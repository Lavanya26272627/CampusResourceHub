// backend/models/Internship.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const InternshipSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        default: 'Remote/On-site',
        trim: true,
    },
    duration: {
        type: String,
        default: '3-6 Months',
    },
    stipend: {
        type: String,
        default: 'Unpaid/Negotiable',
    },
    requirements: {
        type: String,
        trim: true,
    },
    branch: {
        type: String,
        required: true,
        enum: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'General'], 
        default: 'General',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    creatorName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Internship', InternshipSchema);
