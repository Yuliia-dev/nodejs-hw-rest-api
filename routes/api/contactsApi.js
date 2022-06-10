const express = require("express");
const auth = require("../../middlewares/auth");
const {
  getAll,
  getById,
  add,
  updateById,
  removeById,
  updateStatusContact,
} = require("../../controllers/controllersContacts");

const router = express.Router();

router.get("/", auth, getAll);

router.get("/:contactId", getById);

router.post("/", auth, add);

router.put("/:contactId", updateById);

router.patch("/:contactId/favorite", updateStatusContact);

router.delete("/:contactId", removeById);

module.exports = router;
