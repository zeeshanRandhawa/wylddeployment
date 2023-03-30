const mongoose = require("mongoose");

const dishScema = new mongoose.Schema({
  dishName: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  logo: { type: String, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    // required: true,
  },
  // menuId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Menu",
  //   required: true,
  // },
});

const DishModel = mongoose.model("Dish", dishScema);
module.exports = DishModel;
