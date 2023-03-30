const express = require("express");
const orderRouter = express.Router();
const mongoose = require("mongoose");

// Import Order model
const Order = require('../schemas/OrderModel');
//For timezone conversions
const { Convert_TZ, CurrentDateTime } = require("timezone-conversions");
const moment = require("moment")
//Post request for making an order
orderRouter.post('/makeorder', async (req, res) => {
  try {
    const {
      items,//
      totalPrice,
      paymentMethod,
      notes,
      tableNum,
      tip,
      discount,
      restId
    } = req.body;

    const order = new Order({
      items,
      totalPrice,
      paymentMethod,
      notes,
      tableNum,
      tip,
      discount,
      restId
    });

    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error: '+error.message);
  }
});

orderRouter.post('/getlatest', async (req, res) => {
    const { restId, timeZone} = req.body;
    
    
    let morphed = []
    try {
      const orders = await Order.find({ restId }).sort({ createdAt: -1 }).limit(10);
      if (orders.length === 0) {
        return res.json({ orders: [] });
      }

      orders.forEach((order) => {
        let items = ""
       
        order.items.forEach((item)=>{

         
        })
        orderTime = moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss");
        newTimeZone = Convert_TZ(orderTime, "+00:00", timeZone);
        newMoment = moment(newTimeZone);
        formattedDateTime = newMoment.format("DD MMM h:mmA");
       
        morphed.push({

            key:order._id,
            name:"New order",
            detail:items,
            receivedTime: formattedDateTime,
            read: false
        })

      });

      res.json({ orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'API Failure' });
    }
  });
module.exports = orderRouter;