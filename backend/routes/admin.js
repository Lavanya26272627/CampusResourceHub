const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const Resource = require('../models/Resource');
const Internship = require('../models/Internship');

// Add Resource
router.post('/resources', adminMiddleware, async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const resource = new Resource({ title, description, link });
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Internship
router.post('/internships', adminMiddleware, async (req, res) => {
  try {
    const { title, company, location, link } = req.body;
    const internship = new Internship({ title, company, location, link });
    await internship.save();
    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
