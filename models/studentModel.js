const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  enrolledCourse: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courseMappingModel",
    },
  ],
  role: {
    type: String,
    default: 'student'
  }
});

const studentModel = mongoose.model("studentModel", studentSchema);
module.exports = studentModel;
