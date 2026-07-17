import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import {
  authAttempts,
  totalRegisteredUsers,
  failedLoginAttempts,
  successfulLogins,
  userRegistrations,
} from "../lib/metrics.js";
import logger from "../lib/logger.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      logger.warn("Signup failed", {
        event: "signup_failed",
        status: "error",
        fullName,
        email,
        reason: "missing_fields",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      logger.warn("Signup failed", {
        event: "signup_failed",
        status: "error",
        fullName,
        email,
        reason: "password_too_short",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      authAttempts.inc({ type: "signup", status: "failed" });

      logger.warn("Signup failed", {
        event: "signup_failed",
        status: "error",
        email,
        reason: "email_already_exists",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      authAttempts.inc({ type: "signup", status: "success" });
      totalRegisteredUsers.inc();
      userRegistrations.inc();

      logger.info("User registered successfully", {
        event: "signup",
        status: "success",
        userId: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      logger.warn("Signup failed", {
        event: "signup_failed",
        status: "error",
        fullName,
        email,
        reason: "invalid_user_data",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    logger.error("Signup error", {
      event: "signup_error",
      status: "error",
      fullName,
      email,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      authAttempts.inc({ type: "login", status: "failed" });
      failedLoginAttempts.inc();

      logger.warn("Login failed", {
        event: "login_failed",
        status: "error",
        email,
        reason: "user_not_found",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      authAttempts.inc({ type: "login", status: "failed" });
      failedLoginAttempts.inc();

      logger.warn("Login failed", {
        event: "login_failed",
        status: "error",
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        reason: "incorrect_password",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({ message: "Invalid credentials" });
    }

    authAttempts.inc({ type: "login", status: "success" });
    successfulLogins.inc();

    generateToken(user._id, res);

    logger.info("User logged in", {
      event: "login",
      status: "success",
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    logger.error("Login error", {
      event: "login_error",
      status: "error",
      email,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    authAttempts.inc({ type: "logout", status: "success" });

    logger.info("User logged out", {
      event: "logout",
      status: "success",
      userId: req.user?._id,
      fullName: req.user?.fullName,
      email: req.user?.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error", {
      event: "logout_error",
      status: "error",
      userId: req.user?._id,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      logger.warn("Profile update failed", {
        event: "profile_update_failed",
        status: "error",
        userId,
        fullName: req.user?.fullName,
        email: req.user?.email,
        reason: "profile_pic_required",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    logger.info("Profile updated", {
      event: "profile_update",
      status: "success",
      userId: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Profile update error", {
      event: "profile_update_error",
      status: "error",
      userId: req.user?._id,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    logger.info("Authentication verified", {
      event: "check_auth",
      status: "success",
      userId: req.user?._id,
      fullName: req.user?.fullName,
      email: req.user?.email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json(req.user);
  } catch (error) {
    logger.error("Check auth error", {
      event: "check_auth_error",
      status: "error",
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ message: "Internal Server Error" });
  }
};