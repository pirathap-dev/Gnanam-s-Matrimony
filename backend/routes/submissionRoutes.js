const express = require('express');
const { protect } = require('./authRoutes');
const { upload } = require('../utils/cloudinary');
const {
  submitProfile,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
} = require('../controllers/submissionController');

const router = express.Router();

router.post(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'horoscopeFile', maxCount: 1 },
  ]),
  submitProfile
);

router.get('/', protect, getSubmissions);
router.get('/:id', protect, getSubmissionById);
router.patch('/:id/status', protect, updateSubmissionStatus);
router.delete('/:id', protect, deleteSubmission);

module.exports = router;

