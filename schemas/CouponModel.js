const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    couponCode: { type: String, required: true ,unique: true}, //done
    valueType: { type: String, required: true },//done
    valueNum: {type: String, required: true}, //done
    limit: { type: String, required: true },//done
    categories: { type: [], default: [] ,required: true },
    Usage:{type: Number , default: 0},
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CouponModel = mongoose.model('Coupon', couponSchema);

module.exports = CouponModel;