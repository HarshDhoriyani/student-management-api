const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    course: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
      validate: {
        validator: Number.isInteger,
        message: "Age must be a whole number",
      },
    },
  },
  { timestamps: true, versionKey: false }
);

studentSchema.index({ fullName: 1 });

module.exports = mongoose.model("Student", studentSchema);
