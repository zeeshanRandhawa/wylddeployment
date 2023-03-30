const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, //done
    password: { type: String, required: true }, //done
    firstName: { type: String, required: true }, //done
    lastName: { type: String, required: true }, //done
    token: { type: String },
    code: { type: String},
    forgotpasswordcode:{type: String},
    stripeCustomerId: {
      type: String,
      required: false,
    },
    // socialLinks: {
    //   type: [{ name: String, value: String }],
    //   default: [],
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;