const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


const teamSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true }, 
        password: { type: String, required: true }, 
        name: { type: String, required: true }, 
        surname: { type: String, required: true },
        role:{type: String, required: true},
        image:{ type: String, required: true },
        token: { type: String },
        code: { type: String},
        forgotpasswordcode:{type: String},
        userId: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
          required: true,
        },
    },
    {
      timestamps: true,
      versionKey: false,
    })

const TeamModel = mongoose.model('Team', teamSchema);
module.exports = TeamModel;