const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  borrowBooks: [{ type: Schema.Types.ObjectId, ref: "BorrowBook" }],
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: { type: Date, default: null },
});

module.exports = mongoose.model("Payment", paymentSchema);
