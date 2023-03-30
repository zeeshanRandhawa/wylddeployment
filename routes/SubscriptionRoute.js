const { Router } = require("express");
const { stripe } = require("../utils/stripe");
const UserModel = require("../schemas/UserModel");

const subscriptionRouter = Router();

// Get all subscription prices from stripe
subscriptionRouter.get("/prices", async (req, res) => {
  const prices = await stripe.prices.list({
    apiKey: process.env.STRIPE_SK,
  });

  // Response
  return res.json(prices);
});

// Create stripe payment session
subscriptionRouter.post("/session", async (req, res) => {
  const user = await UserModel.findOne({ _id: req.body.userId });

  const session = await stripe.checkout.sessions.create(
    {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN_API}/admin/subscription-success`,
      cancel_url: `${process.env.DOMAIN_API}/admin/subscription-failed`,
      customer: user?.stripeCustomerId,
    },
    {
      apiKey: process.env.STRIPE_SK,
    }
  );

  return res.json(session);
});

// Check user subscription
subscriptionRouter.post("/users/check", async (req, res) => {
  const user = await UserModel.findOne({ _id: req.body.userId });

  // Check user subscription
  const subscriptions = await stripe.subscriptions.list(
    {
      customer: user?.stripeCustomerId,
      status: "all",
      expand: ["data.default_payment_method"],
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  return res.json(subscriptions);
});

module.exports = { subscriptionRouter };
