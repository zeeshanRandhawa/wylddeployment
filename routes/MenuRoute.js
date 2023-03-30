const express = require("express");
const menuRouter = express.Router();
const mongoose = require("mongoose");

// Import Dish model
const Dish = require("../schemas/DishModel");
const Category = require("../schemas/CategoryModel");

// creating a new dish
menuRouter.post("/add-dish", async (req, res) => {
  try {
    // Extract dish information from request body
    const { dishName, price, description, category, ingredients, tags, logo } =
      req.body;

    const categoryObj = await Category.findOne({ categoryName: category });

    if (!categoryObj) {
      return res.status(404).json({ message: "Category not found" });
    }
    const dishExits = await Dish.findOne({ dishName });

    // Create new Dish document using Mongoose model
    if (dishExits) {
      res.status(500).send("Dish already exists");
    } else {
      const newDish = new Dish({
        dishName,
        price,
        description,
        category: categoryObj.categoryName,
        categoryId: categoryObj._id,
        ingredients,
        tags,
        logo,
      });

      // Save new Dish document to MongoDB
      await newDish.save();

      // Return success response
      res.status(201).json({ message: "Dish created successfully" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Error creating dish" });
  }
});

// creating new category
menuRouter.post("/add-category", async (req, res) => {
  try {
    // Extract category information from request body
    const { categoryType, categoryIcon, categoryName } = req.body;

    const categoryExists = await Category.findOne({ categoryName });

    // Create new category document using Mongoose model
    if (categoryExists) {
      res.status(500).json({ message: "Category already exists" });
    } else {
      const newCategory = new Category({
        categoryType,
        categoryIcon,
        categoryName,
      });

      // Save new Dish document to MongoDB
      await newCategory.save();

      // Return success response
      res.status(201).json({ message: "Category created successfully" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Error creating Category" });
  }
});

// get all categories
menuRouter.get("/get-all-categories", async (req, res) => {
  try {
    const categories = await Category.find(
      {},
      { categoryName: 1, categoryIcon: 1 }
    );

    // Create new category document using Mongoose model
    if (!categories) {
      res.status(500).json({ message: "No Category exists" });
    } else {
      // Return success response
      res.status(201).json(categories);
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Error Finding Category" });
  }
});

//get dishes by category
menuRouter.get("/get-dishes/:categoryName", async (req, res) => {
  try {
    let categoryName = req.params.categoryName;

    let search = req.query.search;
    if (categoryName === "All") {
      if (search) {
        const searchFields = ["dishName", "description", "category"];

        // construct the search query with OR condition
        const query = {
          $or: searchFields.map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        };
        const dishes = await Dish.find(query);
        res.status(201).json(dishes);
      } else {
        const dishes = await Dish.find({});
        res.status(201).json(dishes);
      }
    } else {
      const dishes = await Dish.find({ category: categoryName });

      res.status(201).json(dishes);
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Error Finding Dishes" });
  }
});

//get dish by id
menuRouter.get("/get-dish/:_id", async (req, res) => {
  try {
    let _id = req.params._id;

    const [dish] = await Dish.find({ _id: _id }, {});
    res.status(201).send(dish);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Error Finding Dish");
  }
});

//edit categories by id's
menuRouter.put("/edit-category", async (req, res) => {
  try {
    // Extract category information and ID from request body and URL
    const { categoryIcon, categoryName, _id } = req.body;

    // Update category document in MongoDB
    await Category.findByIdAndUpdate(`${_id}`, {
      categoryIcon: categoryIcon,
      categoryName: categoryName,
    });

    // Send success response
    res.status(200).send("Category updated successfully");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Error updating category");
  }
});

//edit dish by id
menuRouter.put("/edit-dish", async (req, res) => {
  try {
    // Extract Dish information and ID from request body and URL
    const {
      _id,
      dishName,
      price,
      description,
      category,
      ingredients,
      tags,
      logo,
    } = req.body;

    // Update Dish document in MongoDB
    await Dish.findByIdAndUpdate(`${_id}`, {
      dishName: dishName,
      price: price,
      description: description,
      category: category,
      ingredients: ingredients,
      tags: tags,
      logo: logo,
    });

    // Send success response
    res.status(200).send("Dish updated successfully");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Error updating Dish");
  }
});

//delete dish record by id
menuRouter.delete("/delete-dish/:_id", async (req, res) => {
  try {
    // Delete Dish information from dish collection
    const _id = req.params._id;

    const result = await Dish.deleteOne({ _id: _id });
    if (result.deletedCount === 0) {
      return res.status(404).send("Dish not found");
    }
    // Send success response
    res.status(200).send("Dish deleted successfully");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Error deleting Dish");
  }
});

module.exports = menuRouter;
