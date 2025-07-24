const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: { 
        type: String,
        enum: {
            values: ['manager', 'librarian', 'member'],
            message: 'Role must be either manager, librarian, or member'
        },
        default: 'member',
    },
    phone: { 
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[\d\s\-\+\(\)]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    street: { 
        type: String,
        trim: true,
        maxlength: [100, 'Street address cannot exceed 100 characters']
    },
    district: { 
        type: String,
        trim: true,
        maxlength: [50, 'District cannot exceed 50 characters']
    },
    city: { 
        type: String,
        trim: true,
        maxlength: [50, 'City cannot exceed 50 characters']
    },
    avatar: { 
        type: String, 
        default: "",
        validate: {
            validator: function(v) {
                return !v || /^https?:\/\/.+/.test(v) || v === "";
            },
            message: 'Avatar must be a valid URL'
        }
    },
    status: {
        type: String,
        enum: {
            values: ['active', 'banned'],
            message: 'Status must be either active or banned'
        },
        default: 'active'
    },
    // OTP fields for email verification from hien branch
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for email for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
