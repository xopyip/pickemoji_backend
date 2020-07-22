const mongoose = require("mongoose");

const QuizStarsSchema = mongoose.Schema({
  stars: {
    type: Number,
    required: true
  },
  author:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  quizz:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const QuizStars = mongoose.model("quiz_stars", QuizStarsSchema);