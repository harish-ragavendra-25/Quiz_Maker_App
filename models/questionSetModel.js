const mongoose = require("mongoose");

const questionSetSchema = new mongoose.Schema({
  label: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    require: true,
  },
  courseMapping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseMappingModel",
    require: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questionModel",
    },
  ],
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'facultyModel'
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  durationOfTest: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const questionSetModel = new mongoose.model(
  "questionSetModel",
  questionSetSchema
);
module.exports = questionSetModel;
