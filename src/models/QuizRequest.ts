const mongoose = require("mongoose");

const QuizRequestSchema = mongoose.Schema({

  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  quiz:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz"
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const QuizRequest = mongoose.model("quiz_request", QuizRequestSchema);