const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    phone: { type: String},
    street: { type: String},
    district: { type: String},
    city: { type: String},
});

module.exports = mongoose.model('User', userSchema);
