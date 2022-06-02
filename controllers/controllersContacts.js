const {
  schemaJoi,
  schemaJoiForFavorite,
  Contact,
} = require("../models/contact");

const getAll = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ code: 200, data: contacts });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contactById = await Contact.findById(contactId);
    console.log(contactById);
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
    const { error } = schemaJoi.validate(req.body);

    if (error) {
      error.status = 400;
      throw error;
    }
    const contact = await Contact.create(req.body);

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
    const { error } = schemaJoi.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;

    const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
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

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = schemaJoiForFavorite.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { contactId } = req.params;
    const { favorite } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      {
        new: true,
      }
    );
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
    const contact = await Contact.findByIdAndDelete(contactId);
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

module.exports = {
  getAll,
  getById,
  add,
  updateById,
  updateStatusContact,
  removeById,
};
