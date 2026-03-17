const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// POST /api/upload
// Protected route to upload a file (PDF or image)
router.post('/', protect, (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error' });
    }

    const file = req.files && req.files[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded. Please select a file.' });
    }

    const fileUrl = `/uploads/${file.filename}`;
    res.json({
      message: 'File uploaded successfully',
      fileUrl: fileUrl
    });
  });
});

module.exports = router;

