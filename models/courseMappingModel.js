const mongoose = require("mongoose");
const courseMappingSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "facultyModel",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseModel",
    required: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentModel",
      required: true,
    },
  ],
  questionSets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questionSetModel",
    },
  ],
});

const courseMappingModel = new mongoose.model(
  "courseMappingModel",
  courseMappingSchema
);
module.exports = courseMappingModel;
