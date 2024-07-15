import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  desc: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  type: {
    type: String,
    enum: ["Official", "Personal", "Hobby"],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
},{timestamps: true});

export default mongoose.model("Todo", todoSchema);
