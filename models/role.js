const e = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ["admin", "manager", "member", "guest"],
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model("Role", roleSchema);
