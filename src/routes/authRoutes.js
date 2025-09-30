const express = require("express");
const {
  login,
  register,
  getUser,
  sendOTP,
  verifyOTP,
  changePassword,
  updateProfile,
  getProfileById,
  verifyEmail
} = require("@controllers/authController");
const {
  getAllProfileBaseOnRole,
  getAllSearchResult,
  updateStatus,
  getAllProfileForAdmin,
  ExperienceVerification,
  EducationVerification,
  CertificationVerification,
  requestVerification,
  getAllVerificationRequest,
  organizationVerify,
  adminVerify
} = require("@controllers/VerificationController");

const { upload } = require("../services/fileUploads");
const { fileUpload, dashboardInfo } = require("@controllers/user");
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
router.get("/getAllProfileForAdmin", getAllProfileForAdmin);
router.post("/ExperienceVerification", ExperienceVerification);
router.post("/EducationVerification", EducationVerification);
router.post("/CertificationVerification", CertificationVerification);
router.get("/dashboardInfo", dashboardInfo);
router.get("/getProfileById", getProfileById);
router.post("/requestVerification", authenticate, requestVerification)
router.get("/getAllVerificationRequest", getAllVerificationRequest)
router.post("/organizationVerify", organizationVerify)
router.post("/adminVerify", authenticate, adminVerify)
router.get("/verify-email",verifyEmail);

module.exports = router;
