const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filterFile: (req, file, cb) => {
    if (file.mimetype.include("image")) {
      cb(null, true);
    } else {
      cb(new Error("Wrong format file"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2048,
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
