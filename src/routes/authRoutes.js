const express = require("express");
const {
  login,
  register,
  getUser,
  sendOTP,
  verifyOTP,
  changePassword,
  updateProfile,
  getAllProfileBaseOnRole,
  getAllSearchResult,
  updateStatus,
} = require("@controllers/authController");

const { upload } = require("../services/fileUploads");
const { fileUpload } = require("@controllers/user");
const { authenticate } = require("@middlewares/authMiddleware");

const router = express.Router();
router.post("/login", login);
router.post("/register", register);
router.post("/profile", authenticate, getUser);
router.post("/sendOTP", sendOTP);
router.post("/updateProfile", updateProfile);
router.post("/verifyOTP", verifyOTP);
router.post("/changePassword", changePassword);
router.get("/getAllProfileBaseOnRole", getAllProfileBaseOnRole);
router.post("/fileupload", upload.single("file"), fileUpload);
router.post("/getAllSearchResult", getAllSearchResult);
router.put("/updateStatus/:id", authenticate, updateStatus);


module.exports = router;
