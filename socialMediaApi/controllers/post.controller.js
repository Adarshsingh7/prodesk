import {
  getOne,
  createOne,
  getAll,
  updateOne,
  deleteOne,
} from "./handelerFactory.js";
import Post from "../models/post.model.js";

const createOnePost = createOne(Post);
const getManyPosts = getAll(Post);
const updateOnePost = updateOne(Post);
const deleteOnePost = deleteOne(Post);
const getOnePost = getOne(Post);

export {
  createOnePost,
  getManyPosts,
  updateOnePost,
  deleteOnePost,
  getOnePost,
};
