const mongoose = require("mongoose");

const testSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentModel",
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "facultyModel",
    required: true,
  },
  courseMapping: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'courseMappingModel',
    required: true
  },
  questionSet:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'questionSetModel',
    required: true
  },
  answer: [
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'questionModel',
            required: true
        },
        selectedOption: String,
        isCorrect: Boolean
    }
  ],
  startedAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  submittedAt:{
    type: Date
  },
  durationTaken: {
    type: Number
  },
  score: {
    type: Number,
    default: 0
  },
  status:{
    type: String,
    enum: ['pending','completed','expired'],
    default: 'pending'
  }
});

const testSessionModel = new mongoose.model("testSessionModel",testSessionSchema);
module.exports = testSessionModel;