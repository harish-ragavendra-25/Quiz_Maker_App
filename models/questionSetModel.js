const mongoose = require("mongoose");

const questionSetSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  courseMapping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseMappingModel",
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questionModel",
    },
  ],
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'facultyModel',
    required: true
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  durationOfTest: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  DueDate: {
    type: Date
  },
  attemptsAllowed: {
    type: Number,
    default: 1,
  }
});

const questionSetModel = new mongoose.model(
  "questionSetModel",
  questionSetSchema
);
module.exports = questionSetModel;
