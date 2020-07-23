const mongoose = require("mongoose");

const QuizDoneSchema = mongoose.Schema({

  quizRequest:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz_request"
  },

  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },

  choice:  {
    type: String
  },

  challenge:  {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const QuizDone = mongoose.model("quiz_done", QuizDoneSchema);