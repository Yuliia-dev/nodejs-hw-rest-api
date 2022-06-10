const express = require("express");
const {
  register,
  login,
  logout,
  getCurrent,
  updateStatusUser,
} = require("../../controllers/controllersUsers");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current", auth, getCurrent);

router.post("/logout", auth, logout);

router.patch("/:userId/subscription", updateStatusUser);

module.exports = router;
