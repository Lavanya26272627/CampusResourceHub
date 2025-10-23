// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    // ... (rest of the protect middleware logic remains the same)
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password'); 

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// FIX: New middleware to check ONLY for the Faculty role
const facultyCheck = (req, res, next) => {
    if (req.user && req.user.role === 'faculty') {
        next(); // User is Faculty, proceed
    } else {
        // Now returns 403 (Forbidden) if the user is a student or unauthenticated
        res.status(403).json({ message: 'Not authorized: Requires Faculty role.' });
    }
};

module.exports = { protect, facultyCheck };