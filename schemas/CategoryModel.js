const mongoose = require("mongoose");

const categoryScema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  categoryType: { type: String, required: true },
  categoryIcon: { type: String, required: true },
  //   menuId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Menu",
  //     required: true,
  //   },
});

const CategoryModel = mongoose.model("Category", categoryScema);
module.exports = CategoryModel;
