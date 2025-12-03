// controllers/authController.js
import { randomBytes } from "crypto"; // ✅ فقط randomBytes ایمپورت شود
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import sendEmail from "../utils/sendEmail.js"; // بعداً تابع ایمیل بساز

const createAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const createRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

export const createSuperAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne();
    if (existingAdmin)
      return res.status(400).json({ message: "Super admin already created!" });

    const { name, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPass,
      role: "superadmin",
    });
    res.json({ message: "Super admin created!", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // save refresh token
    await RefreshToken.create({ token: refreshToken, UserId: user.id });

    res.json({
      message: "Login success",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ message: "Refresh token required" });

    const stored = await RefreshToken.findOne({ where: { token } });
    if (!stored || stored.revoked)
      return res
        .status(403)
        .json({ message: "Refresh token revoked or not found" });

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err)
          return res.status(403).json({ message: "Invalid refresh token" });

        const user = await User.findByPk(payload.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Optional: revoke old refresh token and issue a new one (rotation)
        stored.revoked = true;
        await stored.save();

        const newAccess = createAccessToken(user);
        const newRefresh = createRefreshToken(user);
        await RefreshToken.create({ token: newRefresh, UserId: user.id });

        res.json({ accessToken: newAccess, refreshToken: newRefresh });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { token } = req.body; // refresh token to revoke
    if (!token)
      return res.status(400).json({ message: "Refresh token required" });

    const stored = await RefreshToken.findOne({ where: { token } });
    if (stored) {
      stored.revoked = true;
      await stored.save();
    }
    // client should also remove tokens from localStorage
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = randomBytes(32).toString("hex"); // 🔹 تغییر داده شد
  const expires = Date.now() + 3600000; // 1 ساعت

  user.resetPasswordToken = token;
  user.resetPasswordExpires = expires;
  await user.save();

  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    text: `Click here to reset your password: ${resetUrl}`,
  });

  res.json({ message: "Password reset email sent" });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};