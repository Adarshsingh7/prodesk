import express from "express";
import {
  createOnePost,
  getManyPosts,
  updateOnePost,
  deleteOnePost,
  getOnePost,
} from "../controllers/post.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();

router.use(protect);
router.post("/", createOnePost);
router.get("/", getManyPosts);
router.get("/:id", getOnePost);
router.put("/:id", updateOnePost);
router.delete("/:id", deleteOnePost);

export default router;
