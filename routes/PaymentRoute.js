const { Router } = require("express");
const UserModel = require("../models/user.model");
const RestaurantModel = require("../schemas/RestaurantModel");
const PaymentsModel = require("../schemas/PaymentsModel");
const {
  generateAccessToken,
  verifyAuth,
  checkUserId,
  validateBank,
  validatePaymentkeys,
} = require("../utils");

const paymentRouter = Router();

// Get bank by user id
paymentRouter.get("/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Check user id
      const checkResult = await checkUserId(userId);
      if (typeof checkResult === "string")
        return res.status(400).send(checkResult);
  
      // Get bank
      const bank = await PaymentsModel.findOne({
        userId,
      }).select("-_id -userId");
  
      // Response
      res.status(200).json(bank);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


// Post new bank informaton
paymentRouter.post("/", async (req, res) => {
    // Validate req body
    let validationResult = validateBank(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);
  
    try {
      // Create new bank
      const newBank = new PaymentsModel(req.body);
  
      // Save bank
      const bank = await newBank.save();
      const user = await UserModel.findById(req.body.userId);
  
      // Get user restaurant id
      const restaurant = await RestaurantModel.findOne({
        userId: req.body.userId,
      }).select("_id currency");
  
      // Create and assign a token
      let accessToken = generateAccessToken({
        _id: req.body.userId,
        restaurantId: restaurant?._id,
      });
  
      // Set headers and response
      res.header("auth-token", accessToken).json({
        _id: req.body.userId,
        firstName: user?.firstName,
        email: user?.email,
        restaurantId: restaurant?._id,
        currency: restaurant?.currency,
        accessToken: accessToken,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  paymentRouter.put("/", verifyAuth, async (req, res) => {
    const userId = req.user._id;
  
    // Validate req body
    let validationResult = validateBank(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);
  
    try {
      // Check user id
      const checkResult = await checkUserId(userId);
      if (typeof checkResult === "string")
        return res.status(400).send(checkResult);
  
      // Update bank
      await PaymentsModel.updateOne(
        { userId },
        {
          $set: req.body,
        }
      );
  
      // Response
      res.status(200).json("Bank updated successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
  // Update payments methods by user id
  paymentRouter.put("/methods", verifyAuth, async (req, res) => {
    const userId = req.user._id;
  
    // Validate req body
    let validationResult = validatePaymentkeys(req.body);
    if (validationResult)
      return res.status(400).send(validationResult.details[0].message);
  
    try {
      // Check user id
      const checkResult = await checkUserId(userId);
      if (typeof checkResult === "string")
        return res.status(400).send(checkResult);
  
      // Update bank
      await PaymentsModel.updateOne(
        { userId },
        {
          $set: {
            "paymentsMethods.$[elem].publicKey": req.body.publicKey,
            "paymentsMethods.$[elem].secretKey": req.body.secretKey,
          },
        },
        { arrayFilters: [{ "elem.name": req.body.name }] }
      );
  
      // Response
      res.status(200).json("Payments methods updated successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
module.exports = paymentRouter;