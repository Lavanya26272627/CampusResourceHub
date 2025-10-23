// backend/controllers/resourceController.js

const Resource = require('../models/Resource');

// ======================================================
// 1. Create a New Resource (Faculty Only)
// ======================================================
const createResource = async (req, res) => {
    // req.user is guaranteed to be a Faculty member due to 'facultyCheck' middleware
    const { title, description, url, branch } = req.body;
    
    // Simple validation
    if (!title || !url || !branch) {
        return res.status(400).json({ message: "Please include a title, URL, and branch." });
    }

    try {
        const resource = new Resource({
            title,
            description,
            url,
            branch,
            // Use the ID and name from the authenticated user object
            createdBy: req.user.id, 
            creatorName: req.user.name || req.user.email,
        });

        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ message: "Server error during resource creation." });
    }
};

// ======================================================
// 2. Get Resources (Student and Faculty View)
// ======================================================
const getResources = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userBranch = req.user.branch;

        let resources;

        if (userRole === 'faculty') {
            // Faculty see resources for their branch + general resources
            resources = await Resource.find({ 
                $or: [
                    { branch: userBranch },
                    { branch: 'General' }
                ]
            }).sort({ createdAt: -1 });
            
        } else { // Student role
            // Students see resources only for their branch + general resources
            resources = await Resource.find({ 
                $or: [
                    { branch: userBranch },
                    { branch: 'General' }
                ]
            }).sort({ createdAt: -1 });
        }

        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ message: "Server error while fetching resources." });
    }
};


// ======================================================
// 3. EXPORT THE FUNCTIONS (CRITICAL FIX for your TypeError)
// ======================================================
module.exports = {
    createResource,
    getResources,
};