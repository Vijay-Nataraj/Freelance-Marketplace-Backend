const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../utils/config");

const auth = {
  checkAuth: async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // console.log("Incoming token:", token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Token verification error:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  },

  allowRoles: (roles) => {
    return async (req, res, next) => {
      try {
        // Ensure user is set by checkAuth middleware
        const user = req.user;
        if (!user) {
          return res
            .status(401)
            .json({ message: "Unauthorized: User not found" });
        }

        // Find the user in the database to verify their role
        const dbUser = await User.findById(user.id);
        if (!dbUser) {
          return res.status(404).json({ message: "User not found" });
        }

        // console.log("DB User role:", dbUser.role);

        // Check if the user's role is allowed
        if (!roles.includes(user.role)) {
          return res
            .status(403)
            .json({ message: "Forbidden: You do not have permission" });
        }

        next();
      } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
    };
  },
};

module.exports = auth;
