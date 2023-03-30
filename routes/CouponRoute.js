const express = require("express");
const couponRouter = express.Router();
const { check, validationResult } = require('express-validator')
const Coupon = require("../schemas/CouponModel")

couponRouter.post('/addcoupon',
    check('couponCode', 'Coupon code is required').not().isEmpty(),
    check('valueType', 'Coupon code is required').not().isEmpty(),
    check('valueNum', 'Coupon code is required').not().isEmpty(),
    check('limit', 'Coupon code is required').not().isEmpty(),
    check('categories', 'Coupon code is required').not().isEmpty(),
    check('restaurantId', 'Restaurant Id is required').not().isEmpty(),
    async (req, res) => {
        try {

            // check validations
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                let errorstring = " "
                return res.status(400).json(errors.errors.map(x =>
                    errorstring.concat(x.msg)))
            }
            const checkCode = await Coupon.findOne({ "couponCode": req.body.couponCode });
            if (checkCode) {
                return res.status(400).send("Coupon code must be unique")
            }
            const coupon = await Coupon.create({
                couponCode: req.body.couponCode,
                valueType: req.body.valueType,
                valueNum: req.body.valueNum,
                limit: req.body.limit,
                categories: req.body.categories,
                userId: req.body.userId,
                restaurantId: req.body.restaurantId
            })
            await coupon.save();
            res.status(200).json(coupon);
        } catch (err) {
            res.status(500).send(JSON.stringify(err));
        }

    })

couponRouter.post("/getrestaurantcoupon", check('restaurantId', 'Restaurant Id is required').not().isEmpty(), async (req, res) => {

    try {
         
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errorstring = " "
            return res.status(400).json(errors.errors.map(x =>
                errorstring.concat(x.msg)))
        }

        all_coupon = await Coupon.find({ restaurantId:  req.body.restaurantId })
        if (all_coupon) {
            return res.status(200).json(all_coupon);
        }
        return res.status(400).send("No Coupon Found")
    } catch (err) {
        res.status(500).send(JSON.stringify(err));
    }

})
module.exports = couponRouter;