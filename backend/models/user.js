const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String,
        enum: ['manager', 'librarian', 'member'],
        default: 'member',
    },
    phone: { type: String},
    street: { type: String},
    district: { type: String},
    city: { type: String},
    avatar: { type: String, default: "" }, // <-- thêm dòng này
});

module.exports = mongoose.model('User', userSchema);
