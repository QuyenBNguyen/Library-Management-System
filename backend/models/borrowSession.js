const mongoose = require('mongoose');
const { Schema } = mongoose;

const borrowSessionSchema = new Schema({
    member: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
});

module.exports = mongoose.model('BorrowSession', borrowSessionSchema);
