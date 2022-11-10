const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    age: {
      type: Number,
      trim: true,
      required: true,
    },
    education: {
      type: String,
      required: true,
      maxlength: 64,
      trim: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
