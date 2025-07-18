const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const options = { discriminatorKey: "role", timestamps: true };

const baseUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      required: true,
      enum: ["professional", "company", "Admin"],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  options
);

baseUserSchema.methods.isPasswordMatch = async function (password) {
  return password === this.password;
};

baseUserSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const User = mongoose.model("User", baseUserSchema);

const Professional = User.discriminator(
  "professional",
  new mongoose.Schema({
    fullName: { type: String, trim: true },
    professionalTitle: { type: String, trim: true },
    location: { type: String, trim: true },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"],
    },
    profileImage: { type: String },
    coverImage: { type: String },
    linkedinUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || v.includes("linkedin.com"),
        message: "LinkedIn URL must contain linkedin.com",
      },
    },
    bio: { type: String, trim: true, maxlength: 1500 },
    skills: [String],
    experience: [
      {
        jobTitle: String,
        company: String,
        location: String,
        duration: String,
        description: String,
        status: {
          type: String,
          enum: ["Pending", "Requested", "Approved", "Rejected"],
          default: "Pending",
        },
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
        description: String,
        status: {
          type: String,
          enum: ["Pending", "Requested", "Approved", "Rejected"],
          default: "Pending",
        },
      },
    ],

    referees: [
      {
        fullName: String,
        title: String,
        organization: String,
        email: String,
        contact: Number,
      },
    ],
    languages: [
      {
        language: String,
        level: String,
      },
    ],
  })
);

// ✅ Discriminator: Company
const Company = User.discriminator(
  "company",
  new mongoose.Schema({
    companyName: { Type: String },
    industrySector: String,
    location: String,
    website: String,
    phone: String,
    companySize: String,
    foundedYear: String,
    companyDescription: String,
    aboutUs: String,
    missionStatement: String,
    visionStatement: String,
    companyLogo: String,
    coverImage: String,
    services: [String],
    specializations: [
      {
        title: String,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        client: String,
        yearCompleted: String,
        description: String,
      },
    ],
    teamMembers: [
      {
        fullName: String,
        designation: String,
        description: String,
      },
    ],
  })
);

// ✅ Export all
module.exports = { User, Professional, Company };
