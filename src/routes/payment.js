const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");

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

module.exports = paymentRouter;
