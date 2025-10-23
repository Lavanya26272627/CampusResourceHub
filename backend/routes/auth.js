const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // 🛑 ADJUST THIS PATH if needed

// ======================================================
// 1. DEFINE FUNCTIONS FIRST
// ======================================================

// Minimal Registration Logic (Required to create users with valid password hashes)
const registerUser = async (req, res) => {
    const { email, password, role, branch } = req.body; 

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hashing the Password (CRITICAL STEP)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        // Create new User instance with ALL required fields
        user = new User({
            email,
            password: hashedPassword,
            role: role || 'student',  // Use default if not provided by frontend
            branch: branch || 'General' // Use default if not provided
        });

        await user.save(); 
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("Registration server error:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// Login Logic (Fixes all previous crashes)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const submittedPassword = password;
        const storedHash = user.password;
        
        // 🛑 CRITICAL CHECK: Prevents the "Illegal arguments: string, undefined" crash
        if (!storedHash) {
            console.error("CRITICAL ERROR: User ID:", user._id, "is missing the password hash in the database.");
            return res.status(500).json({ message: "Server error: User record is corrupted (Missing password hash)." });
        }
        
        const isMatch = await bcrypt.compare(submittedPassword, storedHash); 

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        // CRITICAL CHECK: Ensures role/branch are present for the frontend
        if (!user.role || !user.branch) {
            console.error("CRITICAL ERROR: User ID:", user._id, "is missing role or branch data.");
            return res.status(500).json({ message: "Authentication failed due to incomplete user data." });
        }
        
        // Generate Token
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role,      
                branch: user.branch   
            },
            process.env.JWT_SECRET || 'YOUR_SECURE_SECRET', 
            { expiresIn: '1h' }
        );

        // Send Response
        res.status(200).json({ 
            token: token, 
            role: user.role, 
            branch: user.branch 
        });

    } catch (error) {
        console.error("Login server error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};

// ======================================================
// 2. ATTACH FUNCTIONS TO THE ROUTER
// ======================================================

router.post('/login', loginUser); 
router.post('/register', registerUser);

// ======================================================
// 3. EXPORT THE ROUTER
// ======================================================
module.exports = router;