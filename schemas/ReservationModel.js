const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  noOfPersons: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  email: { type: String, required: true },
  start: { type: Date, default: Date.now, required: true },
  end: { type: Date, default: Date.now, required: true },
  resourceTitle: { type: String, required: true },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resources",
    // required: true,
  },
});

const ReservationModel = mongoose.model("Reservations", reservationSchema);
module.exports = ReservationModel;
