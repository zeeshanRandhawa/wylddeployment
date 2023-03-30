const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const restaurantSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true }, //done
    background: { type: String, required: true }, //done
    currency: { type: String, required: true, default: "eur" },  //done
    vatNum: { type: String, required: true, default: "0000-0000" },//done
    // vatPercentage: { type: Number, required: true, default: 19 }, //ask
    slug: { type: String, required: true },
    categories: { type: Array, default: [] },
    bio:{type: String},
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);

module.exports = RestaurantModel;