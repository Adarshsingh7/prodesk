import { Schema, model } from "mongoose";

const commentSchema = new Schema({
  comment: {
    type: String,
    required: [true, "Please provide a content"],
    trim: true,
    maxlength: [1000, "Content cannot be more than 1000 characters"],
    minlength: [1, "Content must be at least 10 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a user"],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Please provide a post"],
  },
});

const Comment = model("Comment", commentSchema);

export default Comment;
