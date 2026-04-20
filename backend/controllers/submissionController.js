const Submission = require('../models/Submission');
const { sendNotificationEmail } = require('../utils/email');
const { isMock, cloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');

exports.submitProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      religion,
      caste,
      location,
      education,
      job,
      familyDetails,
      description,
      preferences, // This comes as a JSON string from frontend due to multipart/form-data
      phone,
      whatsapp,
    } = req.body;

    const parsedPreferences = typeof preferences === 'string' ? JSON.parse(preferences) : preferences;

    let profileImageUrl = req.files['profileImage'] ? req.files['profileImage'][0].path : '';
    let horoscopeFileUrl = req.files['horoscopeFile'] ? req.files['horoscopeFile'][0].path : '';

    if (isMock) {
      if (req.files['profileImage']) {
        profileImageUrl = `http://localhost:5000/uploads/${req.files['profileImage'][0].filename}`;
      }
      if (req.files['horoscopeFile']) {
        horoscopeFileUrl = `http://localhost:5000/uploads/${req.files['horoscopeFile'][0].filename}`;
      }
    }

    const newSubmission = new Submission({
      name,
      age: Number(age),
      gender,
      religion,
      caste,
      location,
      education,
      job,
      familyDetails,
      description,
      preferences: parsedPreferences,
      profileImageUrl,
      horoscopeFileUrl,
      phone,
      whatsapp,
    });

    const savedSubmission = await newSubmission.save();
    
    // Send email to admin asynchronously
    sendNotificationEmail(savedSubmission._id, savedSubmission.name);

    res.status(201).json({ message: 'Submission successful', data: savedSubmission });
  } catch (error) {
    console.error('Error submitting profile:', error);
    res.status(500).json({ message: 'Failed to submit profile', error: error.message });
  }
};

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.status(200).json({ data: submissions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.status(200).json({ data: submission });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch submission', error: error.message });
  }
};

exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.status(200).json({ message: 'Status updated', data: submission });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// Helper: extract Cloudinary public_id from a URL
const extractPublicId = (url) => {
  try {
    // Cloudinary URLs look like:
    // https://res.cloudinary.com/<cloud>/image/upload/v123/folder/filename.ext
    // https://res.cloudinary.com/<cloud>/raw/upload/v123/folder/filename.ext
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    // Remove version prefix (v1234567890/) if present
    let publicIdWithExt = parts[1].replace(/^v\d+\//, '');
    return publicIdWithExt;
  } catch {
    return null;
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (isMock) {
      // Delete local files
      const uploadsDir = path.join(__dirname, '..', 'uploads');
      [submission.profileImageUrl, submission.horoscopeFileUrl].forEach(fileUrl => {
        if (fileUrl) {
          const filename = fileUrl.split('/').pop();
          const filePath = path.join(uploadsDir, filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    } else {
      // Delete from Cloudinary
      if (submission.profileImageUrl) {
        const publicId = extractPublicId(submission.profileImageUrl);
        if (publicId) {
          // Remove file extension for image type
          const idNoExt = publicId.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(idNoExt, { resource_type: 'image', invalidate: true }).catch(err => {
            console.error('Failed to delete profile image from Cloudinary:', err);
          });
        }
      }
      if (submission.horoscopeFileUrl) {
        const publicId = extractPublicId(submission.horoscopeFileUrl);
        if (publicId) {
          // Try raw first (PDFs), then image as fallback
          const isRaw = submission.horoscopeFileUrl.includes('/raw/upload/');
          const resourceType = isRaw ? 'raw' : 'image';
          const idToDelete = isRaw ? publicId : publicId.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(idToDelete, { resource_type: resourceType, invalidate: true }).catch(err => {
            console.error('Failed to delete horoscope from Cloudinary:', err);
          });
        }
      }
    }

    await Submission.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Submission and associated files deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ message: 'Failed to delete submission', error: error.message });
  }
};
