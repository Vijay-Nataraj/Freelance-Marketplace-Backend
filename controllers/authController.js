const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET, NODE_ENV } = require("../utils/config");
const sendEmail = require("../utils/sendEmail");

const authController = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email is already taken" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword, role });

      await newUser.save();
      res
        .status(201)
        .json({ message: "User registered successfully", newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Both email and password are required" });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User does not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "3h",
      });

      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "Strict",
      // });

      res.status(200).json({
        message: "Login successful",
        token,
        user,
        role: user.role,
        userID: user._id,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const token = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex"); // Hash the token
      user.resetPasswordToken = hashedToken;

      user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

      await user.save();

      // Retrieve the origin
      const origin =
        req.get("origin") || `${req.protocol}://${req.get("host")}`;
      const resetURL = `${origin}/api/v1/user/reset-password/${token}`;

      await sendEmail({
        to: email,
        subject: `Password Reset Request`,
        text: `Click on the link to reset your password: ${resetURL}`,
      });

      return res
        .status(200)
        .json({ message: "Password reset link sent", resetURL, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Received token:", token);
    console.log("Received password:", password);
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex"); // Hash the token

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Password reset token is invalid or has expired" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.status(200).json({ message: "Password has been updated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      // clear the token from the cookie
      res.clearCookie("token");

      // return a success message
      res.status(200).json({ message: "Logged out successful" });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUserDetails: async (req, res) => {
    const { name, email, role } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;

      await user.save();
      res
        .status(200)
        .json({ message: "User details updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
