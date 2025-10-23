// backend/controllers/internshipController.js

const Internship = require('../models/Internship'); 

// ======================================================
// 1. Create a New Internship (Faculty Only)
// ======================================================
const createInternship = async (req, res) => {
    // req.user is guaranteed to be Faculty due to 'facultyCheck' middleware
    const { title, company, location, duration, branch, stipend, requirements } = req.body;
    
    // Simple validation
    if (!title || !company || !branch) {
        return res.status(400).json({ message: "Title, Company, and Branch are required." });
    }

    try {
        const internship = new Internship({
            title,
            company,
            location,
            duration,
            branch,
            stipend,
            requirements,
            // Track the creator
            createdBy: req.user.id, 
            creatorName: req.user.name || req.user.email,
        });

        await internship.save();
        res.status(201).json(internship);
    } catch (error) {
        console.error('Error creating internship:', error);
        res.status(500).json({ message: "Server error during internship creation." });
    }
};

// ======================================================
// 2. Get Internships (Student and Faculty View)
// ======================================================
const getInternships = async (req, res) => {
    try {
        const userBranch = req.user.branch;

        // Both roles see internships for their branch + General
        const internships = await Internship.find({ 
            $or: [
                { branch: userBranch },
                { branch: 'General' }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(internships);
    } catch (error) {
        console.error('Error fetching internships:', error);
        res.status(500).json({ message: "Server error while fetching internships." });
    }
};

// ======================================================
// 3. EXPORT THE FUNCTIONS (CRITICAL FIX for your TypeError)
// ======================================================
module.exports = {
    createInternship,
    getInternships,
};