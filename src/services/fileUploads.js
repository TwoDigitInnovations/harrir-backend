const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Hariir_uploads",
    format: async () => "png",
    public_id: (req, file) => {
      const name = Date.now() + "-" + file.originalname;
      console.log("Uploading with public_id:", name);
      return name;
    },
  },
});

module.exports = {
  upload: multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  }),
};
