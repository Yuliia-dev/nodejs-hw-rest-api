const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");
const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).required(),
});

const getAll = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ code: 200, data: contacts });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await getContactById(contactId);
    if (!contactById) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ code: 200, data: contactById });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);

    if (error) {
      error.status = 400;
      throw error;
    }
    const contact = await addContact(req.body);

    if (!contact) {
      const error = new Error("Missing required name field");
      error.status = 400;
      throw error;
    }
    res.status(201).json({ code: 201, data: contact });
  } catch (error) {
    next(error);
  }
};

const updateById = async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;

    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({ code: 200, data: contact });
  } catch (error) {
    next(error);
  }
};

const removeById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res
      .status(200)
      .json({ code: 204, message: "contact deleted", data: contact });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, add, updateById, removeById };
