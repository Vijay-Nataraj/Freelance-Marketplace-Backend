const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.put("/reset-password/:token", authController.resetPassword);
authRouter.post("/logout", authController.logout);

authRouter.get("/", auth.checkAuth, authController.getUserDetails);
authRouter.put("/", auth.checkAuth, authController.updateUserDetails);
module.exports = authRouter;
