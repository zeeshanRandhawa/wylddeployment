const joi = require("joi");
const { Types } = require("mongoose");
const UserModel = require("../schemas/UserModel");
const RestaurantModel = require("../schemas/RestaurantModel");

const validateUser = (data) => {
  const schema = joi.object({
    email: joi.string().required().email().max(255),
    password: joi.string().min(5).max(255),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    phone: joi.number().required(),
    city: joi.string().required().max(255),
    state: joi.string().required().max(255),
    zip: joi.string().required().max(20),
    vatNum: joi.string().max(255),
    vatPercentage: joi.number().max(100),
    businessName: joi.string().required().min(2).max(255),
    businessAddress: joi.string().required().min(2).max(1000),
  });
  return schema.validate(data).error;
};

const validateBusniess = (data) => {
    const schema = joi.object({
    businessName: joi.string().required().min(2).max(255),
    businessAddress: joi.string().required().min(2).max(1000),
    phone: joi.number().required(),
    city: joi.string().required().max(255),
    state: joi.string().required().max(255),
    zip: joi.string().required().max(20),
    vatNum: joi.string().max(255),
    vatPercentage: joi.number().max(100),
    });
    return schema.validate(data).error;
};

const validateEmail = (data) => {
  const schema = joi.object({
    email: joi.string().required().email().max(255),
  });
  return schema.validate(data).error;
};

const validateUpdateUserLinks = (data) => {
  let link = joi.object().keys({
    name: joi
      .string()
      .required()
      .valid("google", "instagram", "telegram", "youtube", "twitter"),
    value: joi.string().required().max(1000),
  });
  const schema = joi.object({
    socialLinks: joi.array().required().items(link),
  });
  return schema.validate(data).error;
};


const validateCheckout = (checkoutEvent) =>{

  
}

module.exports = {
  validateUser,
  validateEmail,
  validateUpdateUserLinks,
};
