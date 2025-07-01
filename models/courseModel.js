const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    require: true
  },
  courseName: {
    type: String,
    require: true,
  },
  courseCategory:{
    type: String,
    enum: ['AIDS','CSE','IT','IOT','ECE','E&I','TRAINING','MECH','CIVIL','BIO MEDICAL'],
    require: true
  },
  description: {
    type: String,
    require: true
  }
});

const courseModel = new mongoose.model("courseModel", courseSchema);
module.exports = courseModel;
