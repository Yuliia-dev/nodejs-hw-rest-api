const express = require("express");
const {
  getAll,
  getById,
  add,
  updateById,
  removeById,
  updateStatusContact,
} = require("../../controllers/controllersContacts");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", add);

router.put("/:contactId", updateById);

router.patch("/:contactId/favorite", updateStatusContact);

router.delete("/:contactId", removeById);

module.exports = router;
