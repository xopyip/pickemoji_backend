const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  icon: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const Category = mongoose.model("category", CategorySchema);