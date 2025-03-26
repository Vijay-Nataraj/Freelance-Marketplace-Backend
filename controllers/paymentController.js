const Razorpay = require("razorpay");
const Payment = require("../models/Payment");
const Contract = require("../models/Contract");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  createOrder: async (req, res) => {
    try {
      const { contractId, amount } = req.body;

      if (!contractId || !amount) {
        return res
          .status(400)
          .json({ message: "Contract ID and amount are required" });
      }

      const contract = await Contract.findById(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      const order = await razorpayInstance.orders.create({
        amount: amount * 100, // Convert to the smallest currency unit
        currency: "INR",
        receipt: `receipt_${contractId}`,
      });

      const payment = new Payment({
        contractId,
        clientId: contract.clientId,
        freelancerId: contract.freelancerId,
        amount,
        razorpayOrderId: order.id,
      });

      await payment.save();
      res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  verifyPayment: async (req, res) => {
    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
        req.body;

      const payment = await Payment.findOne({ razorpayOrderId });
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      const crypto = require("crypto");
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== razorpaySignature) {
        payment.paymentStatus = "Failed";
        await payment.save();
        return res.status(400).json({ message: "Payment verification failed" });
      }

      payment.paymentStatus = "Completed";
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      await payment.save();

      res
        .status(200)
        .json({ message: "Payment verified successfully", payment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paymentController;
