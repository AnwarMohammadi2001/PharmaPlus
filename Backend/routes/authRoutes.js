import express from "express";
import {
  createSuperAdmin,
  login,
  getMe,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-superadmin", createSuperAdmin);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);
// فراموشی رمز
router.post("/forgot-password", forgotPassword);

// تغییر رمز
router.post("/reset-password", resetPassword);

export default router;
