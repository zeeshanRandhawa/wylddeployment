const mongoose = require("mongoose");

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    name: { type: String, required: true },
    iban: { type: String, required: true },
    bic: { type: String, required: true },
    customerFees: { type: Boolean, required: true, default: false },
    paymentsMethods: {
      type: [
        { name: String, publicKey: String, secretKey: String }
      ],
      default: [
        { name: "stripe", publicKey: "", secretKey: "" },
        { name: "paypal", publicKey: "", secretKey: "" } //For later
      ]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    }
  },
  {
    versionKey: false
  }
);

const PaymentsModel = mongoose.model("Payment", paymentSchema);

module.exports = PaymentsModel;
