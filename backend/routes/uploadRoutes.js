const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Bypass simulator for when credentials aren't provided yet
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY.includes('your_api_key')) {
        console.warn("Cloudinary keys missing! Simulating image upload bypass locally.");
        return res.json({ url: '/images/sheikh.png' });
    }

    // Cloudinary natively requires a stream or data URI if buffering in memory
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'seyal_imperial',
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Image Upload Error:', error);
    res.status(500).json({ message: 'Image could not be uploaded' });
  }
});

module.exports = router;
