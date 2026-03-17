const express = require('express');
const router = express.Router();
const { submitContactForm } = require('../controllers/contactController');

// @route   POST /api/contact
// @desc    Submit contact form and send emails
// @access  Public
router.post('/', submitContactForm);

module.exports = router;
