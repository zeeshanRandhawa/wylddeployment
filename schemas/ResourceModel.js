const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  resourceTitle: { type: String, required: true },
  //   resourceId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Resources",
  //     // required: true,
  //   },
});

const ResourceModel = mongoose.model("Resources", resourceSchema);
module.exports = ResourceModel;
