const express = require("express");
const {
  getAll,
  getById,
  add,
  updateById,
  removeById,
} = require("../../controllers/controllersContacts");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", add);

router.put("/:contactId", updateById);

router.delete("/:contactId", removeById);

module.exports = router;
