const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema(
  {
    items: { type: [], required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["PayPal", "Visa", "Apple pay", "Google pay", "Cash"],
      required: true,
    },
    notes: { type: String },
    tableNum: { type: Number, required: true },
    tip: { type: Number },
    discount: {
      code: { type: String, required: true },
      type: { type: String, enum: ["percentage", "amount"], required: true },
      value: { type: Number, required: true },
    },
    restId: {
      type: ObjectId,
      ref: "Restaurant",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;