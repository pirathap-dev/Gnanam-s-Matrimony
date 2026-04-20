const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const isMock = process.env.CLOUDINARY_API_KEY === 'mock_key' || !process.env.CLOUDINARY_API_KEY;

let storage;

if (isMock) {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
  console.log('Using local DiskStorage for Multer (Mock Key Detected)');
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        return {
          folder: 'gnanams_matrimony',
          allowed_formats: ['pdf'],
          resource_type: 'image',
        };
      }
      return {
        folder: 'gnanams_matrimony',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        resource_type: 'image',
      };
    },
  });
  console.log('Using Cloudinary Storage for Multer');
}

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload, isMock };
