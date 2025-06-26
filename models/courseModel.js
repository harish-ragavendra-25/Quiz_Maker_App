const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String
  }
});

const courseModel = new mongoose.model("courseModel", courseSchema);
module.exports = courseModel;
