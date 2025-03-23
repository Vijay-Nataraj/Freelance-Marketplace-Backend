const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const roleRouter = require("./routes/roleRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Configure CORS to allow requests from 'http://localhost:5173' and 'https://vjn-freelance-marketplace.netlify.app'
const allowedOrigins = [
  "https://vjn-freelance-marketplace.netlify.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow if origin is in allowed list or if it's a same-origin request
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Apply cors to express.
app.use(cors(corsOptions));

app.use("/api/v1/user", authRouter);
app.use("/api/v1/roles", roleRouter);

module.exports = app;
