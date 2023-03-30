const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true }, //done
    phone: { type: Number, required: true },//done
    street: {type: String, required: true}, //done
    city: { type: String, required: true },//done
    state: { type: String, required: false },//done opt
    postal: { type: String, required: true },//done
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BusinessModel = mongoose.model('Business', businessSchema);

module.exports = BusinessModel;