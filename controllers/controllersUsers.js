const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const {
  schemaJoiRegister,
  schemaJoiLogin,
  schemaJoiForSubscription,
  User,
} = require("../models/user");
const sharp = require("sharp");
const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  try {
    const { error } = schemaJoiRegister.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    const { name, email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const error = new Error("Email in use");
      error.status = 409;
      throw error;
    }

    const avatarURL = gravatar.url(email, {}, true);
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      subscription,
      avatarURL,
    });
    res.status(201).json({
      code: 201,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = schemaJoiLogin.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email });
    const passCompare = bcrypt.compareSync(password, user.password);

    if (!user || !passCompare) {
      const error = new Error("Email or password is wrong");
      error.status = 401;
      throw error;
    }
    const payload = {
      id: user._id,
      subscription: user.subscription,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      code: 200,
      data: {
        user: { token },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { name, email } = req.user;
    res.status(200).json({
      code: 200,
      data: {
        user: { name, email },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateStatusUser = async (req, res, next) => {
  try {
    const { error } = schemaJoiForSubscription.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }
    const { userId } = req.params;
    const { subscription } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { subscription },
      {
        new: true,
      }
    );
    if (!user) {
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.status(200).json({
      code: 200,
      data: { name: user.name, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id } = req.user;
  const imageName = `${_id}_${originalname}`;
  try {
    const resultUpload = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      imageName
    );
    await sharp(tempUpload).resize(250).toFile(resultUpload);

    const avatarURL = path.join("public", "avatars", imageName);

    await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL },
      {
        new: true,
      }
    );

    res.status(200).json({
      code: 200,
      data: { avatarURL },
    });
  } catch (error) {
    await fs.unlink(tempUpload);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateStatusUser,
  updateAvatar,
};
