const { Schema, model } = require("mongoose");
const Joi = require("joi");

const schemaJoi = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
  favorite: Joi.bool(),
});

const schemaJoiForFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const schemaContact = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", schemaContact);

module.exports = { schemaJoi, schemaJoiForFavorite, Contact };
