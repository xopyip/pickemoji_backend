import {Roles} from "../Roles";

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: false,
    default: Roles.USER
  },
  about: {
    type: String,
    required: false,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export const User = mongoose.model("user", UserSchema);