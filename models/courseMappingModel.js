const mongoose = require("mongoose");
const courseMappingSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "facultyModel",
    require: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseModel",
    require: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "studentModel",
      require: true,
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
