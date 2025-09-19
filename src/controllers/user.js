const { User } = require("../models/User");
const response = require("../../responses");

module.exports = {
  fileUpload: async (req, res) => {
    try {
      if (!req.file) {
        return response.badRequest(res, { message: "No file uploaded." });
      }
      return response.ok(res, {
        message: "File uploaded successfully.",
        fileUrl: req.file.path,
        fileName: req.file.filename,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  dashboardInfo: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProfessionals = await User.countDocuments({
        role: "professional",
      });
      const totalCompanies = await User.countDocuments({ role: "company" });

      const activeProfiles = await User.countDocuments({ status: "Approved" });
      const pendingProfiles = await User.countDocuments({ status: "Pending" });

      return res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalProfessionals,
          totalCompanies,
          activeProfiles,
          pendingProfiles,
        },
      });
    } catch (error) {
      console.error("Error in dashboardInfo:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching dashboard info",
        error: error.message,
      });
    }
  },
};
