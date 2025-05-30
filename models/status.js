const mongoose = require('mongoose');
const { Schema } = mongoose;

const statusSchema = new Schema({
    status: { type: String, required: true},
});

module.exports = mongoose.model('Status', statusSchema);
