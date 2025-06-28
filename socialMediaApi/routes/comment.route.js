import express from "express";
import {
  createOneComment,
  updateOneComment,
  deleteOneComment,
} from "../controllers/comment.controller.js";
import { protect } from "../controllers/auth.controller.js";

const router = express.Router();

router.use(protect);
router.post("/", createOneComment);
router.put("/:id", updateOneComment);
router.delete("/:id", deleteOneComment);

export default router;
