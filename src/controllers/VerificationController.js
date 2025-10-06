const { User, Professional, Company } = require("../models/User");
const Verification = require("../models/experianceVerification");
const response = require("../../responses");

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
      const user = await User.find({
        isVerified: true,
      });
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

  requestVerification: async (req, res) => {
    try {
      const { experienceId, userId } = req.body;

      const professional = await Professional.findById(userId);
      if (!professional) {
        return response.badReq(res, { message: "Professional not found" });
      }

      const experience = professional.experience.id(experienceId);
      if (!experience) {
        return response.badReq(res, { message: "Experience not found" });
      }

      const company = await Company.findOne({
        companyName: experience.company,
      });

      if (!company) {
        experience.ForAdminStatus = "Requested";

        await professional.save();
        return response.ok(res, {
          message:
            "Your company is not listed in our system. The request has been forwarded for Admin verification.",
        });
      }

      const verification = await Verification.create({
        user: userId,
        experience: experience._id,
        organization: company ? company._id : null,
      });

      experience.ForOrganizationStatus = "Requested";
      await professional.save();

      return response.ok(res, {
        message: "Verification request submitted successfully",
        verification,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  organizationVerify: async (req, res) => {
    try {
      const { verificationId, status, userId } = req.body;

      const verification = await Verification.findById(verificationId);
      if (!verification) {
        return response.badReq(res, { message: "Verification not found" });
      }

      if (String(verification.organization) !== String(userId)) {
        return response.badReq(res, { message: "Unauthorized action" });
      }

      verification.organizationStatus = status;
      await verification.save();

      const professional = await Professional.findById(verification.user);
      const exp = professional.experience.id(verification.experience);
      exp.ForOrganizationStatus = status;
      await professional.save();

      return response.ok(res, {
        message: `Organization ${status} the experience`,
        verification,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
  adminVerify: async (req, res) => {
    try {
      const { adminId, userId, experienceId, status } = req.body;

      const admin = await User.findById(adminId);
      if (!admin || admin.role !== "Admin") {
        return response.badRequest(res, { message: "Unauthorized access" });
      }

      let verification = await Verification.findOne({
        user: userId,
        experience: experienceId,
      });
      const professional = await Professional.findById(userId);
      if (!professional) {
        return response.badRequest(res, { message: "Professional not found" });
      }

      const exp = professional.experience.id(experienceId);
      if (!exp) {
        return response.badRequest(res, { message: "Experience not found" });
      }

      if (!verification) {
        exp.ForAdminStatus = status;
        await professional.save();

        return response.ok(res, {
          message: `${status} the experience successfully`,
        });
      }

      verification.adminStatus = status;
      exp.ForAdminStatus = status;

      await verification.save();
      await professional.save();

      return response.ok(res, {
        message: `${status} the experience successfully`,
        verification,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getAllVerificationRequest: async (req, res) => {
    try {
      const { CompanyId } = req.query;

      if (!CompanyId) {
        return response.error(res, {
          message: "CompanyId is required",
        });
      }

      const verifications = await Verification.find({ organization: CompanyId })
        .populate("user")
        .populate("organization")
        .populate("experience")
        .lean()
        .sort({ createdAt: -1 });

      if (!verifications || verifications.length === 0) {
        return response.ok(res, {
          message: "No verification requests found",
          data: [],
        });
      }

      const data = verifications.map((v) => {
        const userExp = v.user?.experience?.find(
          (exp) => exp._id.toString() === v.experience.toString(),
        );
        return {
          ...v,
          experience: userExp || null,
        };
      });
      return response.ok(res, {
        message: "Verification requests fetched successfully",
        data: data,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },
};
