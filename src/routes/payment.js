const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { firstName, lastName, emailId } = req.user;
  const { membershipType } = req.body;

  var options = {
    amount: membershipAmount[membershipType] * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    receipt: "order_rcptid_11",
    notes: {
      firstName,
      lastName,
      emailId,
      membershipType,
    },
  };
  try {
    const order = await razorpayInstance.orders.create(options);
    const payment = new Payment({
      userId: req?.user?._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

// Note: It's webhook API, don't pass userAuth as it's coming from razorpay.
paymentRouter.post("/payment/webhook", async (req, res) => {
  const webhookSignature = req.headers["X-Razorpay-Signature"];

  const isWebhookValid = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    process.env.RAZORPAY_WEBHOOK_SECRET
  );

  if (!isWebhookValid) {
    return res.status(400).json({ msg: "Webhook signature is invalid" });
  }
  // update my payment status in DB
  const paymentDetails = req.body.payload.payment.entity;
  const paymentRecord = await Payment.findOne({
    orderId: paymentDetails.order_id,
  });
  if (!paymentRecord) {
    return res.status(404).json({ msg: "Payment record not found" });
  }
  paymentRecord.status = paymentDetails.status;
  await paymentRecord.save();

  // Update the user as premium
  const user = await User.findOne({ _id: paymentRecord.userId });
  user.isPremium = true;
  user.membershipType = paymentRecord.notes.membershipType;
  await user.save();

  // if (req.body.event === "payment.captured") {
  // }

  // if (req.body.event === "payment.failed") {
  // }

  // return success response to razorpay
  res.status(200).json({ msg: "request successful" });
});

// just to check whether user is premium or not
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user;
  if (user.isPremium) {
    return res.status(200).send({ isPremium: true });
  }
  return res.status(200).send({ isPremium: false });
});

module.exports = paymentRouter;
