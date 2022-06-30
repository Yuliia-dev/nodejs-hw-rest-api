const Joi = require("joi");
const { Schema, model } = require("mongoose");
const { v4 } = require("uuid");

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

const schemaJoiForVerifyEmail = Joi.object({
  email: Joi.string().required(),
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
    avatarURL: {
      type: String,
      required: [true, "Add avatar for user"],
    },
    token: {
      type: String,
      default: null,
    },

    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: v4(),
    },
  },
  { versionKey: false, timestamps: true }
);

const User = model("user", schemaUser);

module.exports = {
  schemaJoiRegister,
  schemaJoiLogin,
  schemaJoiForSubscription,
  schemaJoiForVerifyEmail,
  User,
};
