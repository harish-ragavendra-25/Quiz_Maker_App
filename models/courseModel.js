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
  courseCategory:{
    type: String,
    enum: ['AIDS','CSE','IT','IOT','ECE','E&I','TRAINING','MECH','CIVIL','BIO MEDICAL'],
    required: true
  },
  status:{
    type: String,
    enum: ['active','inactive'],
    required: true,
    default: 'active'
  },
  description: {
    type: String,
    required: true
  }
});

const courseModel = new mongoose.model("courseModel", courseSchema);
module.exports = courseModel;
