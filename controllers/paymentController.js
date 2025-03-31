const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Contract = require("../models/Contract");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  // Create Razorpay Order
  createOrder: async (req, res) => {
    try {
      const { amount, contractId } = req.body;

      // Fetch contract details (client and freelancer information)
      const contract = await Contract.findById(contractId);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }

      const options = {
        amount: amount * 100, // Amount in paise (1 INR = 100 paise)
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      };

      // Create the order in Razorpay
      razorpayInstance.orders.create(options, async (err, order) => {
        if (err) {
          console.error("Error creating order:", err);
          return res
            .status(500)
            .json({ message: "Error creating payment order" });
        }

        const payment = new Payment({
          contractId,
          clientId: contract.clientId,
          freelancerId: contract.freelancerId,
          amount,
          razorpayOrderId: order.id,
        });

        await payment.save();

        res.status(200).json({
          orderId: order.id,
          amount: options.amount / 100,
          currency: options.currency,
        });
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // Verify the Razorpay Payment
  verifyPayment: async (req, res) => {
    const { paymentId, orderId, signature } = req.body;

    const body = orderId + "|" + paymentId;

    try {
      const payment = await Payment.findOne({ razorpayOrderId: orderId });

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest("hex");

      if (generatedSignature === signature) {
        // Update payment status to 'Completed'
        Payment.paymentStatus = "Completed";
        const Payment = new Payment({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });
        await payment.save();

        res.status(200).json({ message: "Payment verification successful" });
      } else {
        res.status(400).json({ message: "Invalid signature" });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = paymentController;
