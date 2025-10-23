// backend/controllers/authController.js

const User = require('../models/User');
// FIX: Using the correct installed package
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password, branch, role } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 1. Hash the password
        const hashed = await bcrypt.hash(password, 10);
        
        // 2. Create and save the user with the HASHED password
        const user = new User({ name, email, password: hashed, branch, role });
        await user.save();

        // Token generation
        const token = jwt.sign(
            { id: user._id, role: user.role, branch: user.branch }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: "Registration successful",
            token,
            // Provide all necessary data for the frontend
            role: user.role,
            branch: user.branch,
            user: { id: user._id, name: user.name, email: user.email, branch: user.branch, role: user.role }
        });
    } catch (err) {
        console.error('Registration Error:', err.message); 
        res.status(500).json({ message: "An unexpected server error occurred during registration." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // FIX: Query without .select('+password') because it was removed from model
        const user = await User.findOne({ email }); 
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials (User not found)" });
        }
        
        // CRITICAL CHECK: Prevents the "Missing password hash" error
        if (!user.password) {
             console.error(`User ID ${user._id} has a corrupted record (missing password hash).`);
             return res.status(500).json({ message: "Server error: User record is corrupted (Missing password hash)." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (Password mismatch)" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role, branch: user.branch }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            role: user.role,
            branch: user.branch,
            // Optional: for frontend convenience
            user: { id: user._id, name: user.name, email: user.email, branch: user.branch, role: user.role }
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: "An unexpected server error occurred during login." });
    }
};

module.exports = { registerUser, loginUser };