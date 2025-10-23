// backend/routes/internships.js

const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
// FIX: Import the simplified 'facultyCheck' middleware
const { protect, facultyCheck } = require('../middleware/authMiddleware');

// @route   POST /api/internships
// @desc    Create a new internship listing (PROTECTED: Faculty ONLY)
// @access  Private (Faculty)
// FIX: Using facultyCheck here
router.post('/', protect, facultyCheck, internshipController.createInternship); 

// @route   GET /api/internships
// @desc    Get all internship listings (PUBLIC: All logged-in users)
// @access  Private (All authenticated users)
router.get('/', protect, internshipController.getInternships); 

module.exports = router;