const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
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
  assignedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courseMappingModel",
    },
  ],
});

const facultyModel = new mongoose.model("facultyModel", FacultySchema);
module.exports = facultyModel;
