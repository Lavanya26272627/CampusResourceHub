// backend/routes/resources.js

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
// FIX: Use the new 'facultyCheck' middleware
const { protect, facultyCheck } = require('../middleware/authMiddleware');

// @route   POST /api/resources
// @desc    Create a new resource (PROTECTED: Faculty ONLY)
// @access  Private (Faculty)
router.post('/', protect, facultyCheck, resourceController.createResource); 

// @route   GET /api/resources
// @desc    Get all resources (All logged-in users)
// @access  Private (All authenticated users)
router.get('/', protect, resourceController.getResources); 

module.exports = router;
