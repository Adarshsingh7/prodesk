import express from "express";

import { signup, login, protect } from "../controllers/auth.controller.js";
import { updateMe, getMe } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.use(protect);
router.post("/updateMe", updateMe);
router.get("/me", getMe);

export default router;
