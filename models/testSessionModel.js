const mongoose = require("mongoose");

const testSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentModel",
    require: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "facultyModel",
    require: true,
  },
  courseMapping: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'courseMappingModel',
    require: true
  },
  questionSet:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'questionSetModel',
    require: true
  },
  answer: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'questionModel',
            require: true
        },
        selectedOption: String,
        isCorrect: Boolean
  }],
  startedAt:{
    type: Date,
    default: Date.now
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