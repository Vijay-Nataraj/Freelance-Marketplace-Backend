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
app.use(
  cors({
    origin: "https://vjn-freelance-marketplace.netlify.app",
    credentials: true,
  })
);

app.use("/api/v1/user", authRouter);
app.use("/api/v1/roles", roleRouter);

module.exports = app;
