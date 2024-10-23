const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'owner'],
        default: 'user'
    },
    completedTests: [
        {
            skill: { type: String, required: true },
            difficulty: { type: String, required: true }
        }
    ]
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;
