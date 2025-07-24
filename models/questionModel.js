const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  mark: {
    type: Number,
    default: 1,
  },
});

const questionModel = new mongoose.model("questionModel", questionSchema);
module.exports = questionModel;
