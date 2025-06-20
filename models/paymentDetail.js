const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentDetailSchema = new Schema({
    payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    amount: { type: Number, required: true }
});

module.exports = mongoose.model('PaymentDetail', paymentDetailSchema);
