import { Schema, model } from "mongoose";

const postSchema = new Schema({
  content: {
    type: String,
    required: [true, "Please provide a content"],
    trim: true,
    maxlength: [1000, "Content cannot be more than 1000 characters"],
    minlength: [10, "Content must be at least 10 characters"],
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
  likes: {
    type: Number,
    default: 0,
    min: [0, "Likes cannot be negative"],
  },
});

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  options: { select: "-__v" },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "name",
  });
  next();
});

const Post = model("Post", postSchema);

export default Post;
