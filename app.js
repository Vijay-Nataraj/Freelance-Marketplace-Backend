const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routes/authRoutes");
const roleRouter = require("./routes/roleRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const jobRouter = require("./routes/jobRoutes");
const proposalRouter = require("./routes/proposalRoutes");
const contractRouter = require("./routes/contractRoutes");
const PaymentRouter = require("./routes/paymentRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const allowedOrigins = [
  "http://localhost:5173",
  // "https://vjn-freelance-marketplace.netlify.app",
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
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Apply cors to express.
app.use(cors(corsOptions));

app.use("/api/v1/user", authRouter);
app.use("/api/v1/roles", roleRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/proposal", proposalRouter);
app.use("/api/v1/contract", contractRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payments", PaymentRouter);

module.exports = app;
