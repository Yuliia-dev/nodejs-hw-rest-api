const Joi = require("joi");
const { Schema, model } = require("mongoose");

const schemaJoiRegister = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string(),
});

const schemaJoiLogin = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string(),
});

const schemaJoiForSubscription = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const schemaUser = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", schemaUser);

module.exports = {
  schemaJoiRegister,
  schemaJoiLogin,
  schemaJoiForSubscription,
  User,
};
