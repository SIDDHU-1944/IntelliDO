import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  progress: [
    {
      date: Date,
      percentage: Number,
    },
  ],
});

const User = mongoose.model("User", userSchema);
export { User };
