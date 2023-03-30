const express = require("express");
const reservationRouter = express.Router();
const mongoose = require("mongoose");

// Import Table model
const Resources = require("../schemas/ResourceModel");
const Reservations = require("../schemas/ReservationModel");

// creating a new Table
reservationRouter.post("/add-tables", async (req, res) => {
  try {
    // Extract Table information from request body
    const { resourceTitle } = req.body;


    resourceTitle?.map(async (values) => {
      const tableExists = await Resources.findOne({
        resourceTitle: values.value,
      });

      // Create new Table document using Mongoose model
      if (tableExists) {
        res.status(500).send("Table already exists");
      } else {
        const newTable = new Resources({
          resourceName: resourceTitle,
        });

        // Save new Table document to MongoDB
        await newTable.save();

        // Return success response
        res.status(201).json({ message: "Table created successfully" });
      }
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Error creating Table" });
  }
});

module.exports = reservationRouter;
