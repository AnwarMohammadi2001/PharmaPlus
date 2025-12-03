import express from "express";
import {
  createSuperAdmin,
  login,
  getMe,
  refreshToken,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-superadmin", createSuperAdmin);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

export default router;
