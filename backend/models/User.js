// backend/models/User.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required for registration.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'] 
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.']
    },
    // FIX: Removed 'admin' from enum
    role: {
        type: String,
        required: true,
        enum: ['student', 'faculty'], 
        default: 'student',
    },
    branch: {
        type: String,
        required: true,
        enum: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'General'], 
        default: 'General',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);