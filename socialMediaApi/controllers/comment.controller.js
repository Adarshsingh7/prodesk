import { createOne, updateOne, deleteOne } from "./handelerFactory.js";
import Comment from "../models/post.model.js";

const createOneComment = createOne(Comment);
const updateOneComment = updateOne(Comment);
const deleteOneComment = deleteOne(Comment);

export { createOneComment, updateOneComment, deleteOneComment };
