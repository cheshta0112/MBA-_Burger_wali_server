import express from "express";
import passport from "passport";
import {
  getAdminStats,
  getAdminUsers,
  logout,
  myProfile,
  signUp,
} from "../controllers/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/User.js";

import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/googlelogin",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/login",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL,
  })
);

router.post(
  "/logging",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    // Send a JSON response indicating a successful login
    res.status(200).json({ success: true, message: "Login successful" });
  }
);

router.post("/sign-up", signUp);

router.post("/sign-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return next(new ErrorHandler("Invalid credentials", 401));
    }

    // If authentication is successful, create a JWT token
    const secretKey = "mbaburgerwali";
    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
});

router.get("/me", isAuthenticated, myProfile);

router.get("/logout", logout);

// Admin Routes
router.get("/admin/users", isAuthenticated, authorizeAdmin, getAdminUsers);

router.get("/admin/stats", isAuthenticated, authorizeAdmin, getAdminStats);

export default router;
