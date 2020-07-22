const mongoose = require("mongoose");

const QuizSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  doneCounter: {
    type: Number,
    default: 0
  },
  author:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  category:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category"
  },
  accepted:  {
    type: Boolean,
    default: false
  },
  emojis: [{emoji: String, desc: String}],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const Quiz = mongoose.model("quiz", QuizSchema);