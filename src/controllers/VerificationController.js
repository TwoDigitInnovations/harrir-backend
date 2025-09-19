const { User, Professional } = require("../models/User");

module.exports = {
  getAllProfileBaseOnRole: async (req, res) => {
    try {
      const { role } = req.query;
      const query = {
        ...(role && { role }),
        status: "Approved", // ✅ Only fetch users with status "Approved"
      };

      const user = await User.find(query);

      res.status(200).json({
        status: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },
  getAllProfileForAdmin: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json({
        status: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  getAllSearchResult: async (req, res) => {
    try {
      const { role, searchTerm } = req.query;

      const query = {
        status: "Approved", // ✅ Only fetch users with Approved status
      };

      if (role) {
        query.role = role;
      }

      if (req.body.selectedLocation) {
        query.location = req.body.selectedLocation;
      }

      if (searchTerm) {
        const searchRegex = new RegExp(searchTerm, "i"); // case-insensitive
        query.$or = [
          { companyName: searchRegex },
          { fullName: searchRegex },
          { skills: { $in: [searchRegex] } },
        ];
      }

      const users = await User.find(query);

      res.status(200).json({
        status: true,
        message: "User profile fetched successfully",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["Pending", "Approved", "Rejected"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid Status value" });
      }

      const updatedData = await User.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );

      if (!updatedData) {
        return res.status(404).json({ message: "Data not found" });
      }

      res.status(200).json({
        message: `Status updated to ${status}`,
        data: updatedData,
      });
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  ExperienceVerification: async (req, res) => {
    try {
      const { userId, experienceId, status } = req.body;

      if (!userId || !experienceId) {
        return res.status(400).json({
          status: false,
          message: "User ID and Experience ID are required",
        });
      }

      const user = await Professional.findById(userId);
      if (!user || user.role !== "professional") {
        return res.status(404).json({
          status: false,
          message: "Professional user not found",
        });
      }

      const experienceIndex = user.experience.findIndex(
        (exp) => exp._id.toString() === experienceId,
      );

      if (experienceIndex === -1) {
        return res.status(404).json({
          status: false,
          message: "Experience entry not found",
        });
      }

      user.experience[experienceIndex].status = status;
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Experience verification requested successfully",
        data: user.experience[experienceIndex],
      });
    } catch (error) {
      console.error("Error requesting experience verification:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  EducationVerification: async (req, res) => {
    try {
      const { userId, educationId, status } = req.body;

      if (!userId || !educationId) {
        return res.status(400).json({
          status: false,
          message: "User ID and Education ID are required",
        });
      }

      const user = await Professional.findById(userId);
      if (!user || user.role !== "professional") {
        return res.status(404).json({
          status: false,
          message: "Professional user not found",
        });
      }

      const educationIndex = user.education.findIndex(
        (exp) => exp._id.toString() === educationId,
      );

      if (educationIndex === -1) {
        return res.status(404).json({
          status: false,
          message: "Education entry not found",
        });
      }

      user.education[educationIndex].status = status;
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Education verification requested successfully",
        data: user.education[educationIndex],
      });
    } catch (error) {
      console.error("Error requesting Education verification:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  CertificationVerification: async (req, res) => {
    try {
      const { userId, certificationId, status } = req.body;

      if (!userId || !certificationId) {
        return res.status(400).json({
          status: false,
          message: "User ID and Certification ID are required",
        });
      }

      const user = await Professional.findById(userId);
      if (!user || user.role !== "professional") {
        return res.status(404).json({
          status: false,
          message: "Professional user not found",
        });
      }

      const certificationIndex = user.certifications.findIndex(
        (cert) => cert._id.toString() === certificationId,
      );

      if (certificationIndex === -1) {
        return res.status(404).json({
          status: false,
          message: "Certification entry not found",
        });
      }

      user.certifications[certificationIndex].status = status;
      await user.save();

      return res.status(200).json({
        status: true,
        message: "Certification verification requested successfully",
        data: user.certifications[certificationIndex],
      });
    } catch (error) {
      console.error("Error requesting Certification verification:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};
