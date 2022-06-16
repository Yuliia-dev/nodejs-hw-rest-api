const express = require("express");
const {
  register,
  login,
  logout,
  getCurrent,
  updateStatusUser,
  updateAvatar,
} = require("../../controllers/controllersUsers");
const auth = require("../../middlewares/auth");
const upload = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current", auth, getCurrent);

router.post("/logout", auth, logout);

router.patch("/:userId/subscription", updateStatusUser);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

module.exports = router;
