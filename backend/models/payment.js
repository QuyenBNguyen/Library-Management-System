const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
