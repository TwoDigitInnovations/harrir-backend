const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
      enum: ["PublicProfile", "ProfessionalProfile"],
    },
    fullName: {
      type: String,
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
    },
    professionalTitle: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"],
    },
    linkedinUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || v.includes("linkedin.com");
        },
        message: "LinkedIn URL must contain linkedin.com",
      },
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio must not exceed 500 characters"],
    },
    profileImage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordMatch = async function (password) {
  return password === this.password;
};

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const User = mongoose.model("User", userSchema);

module.exports = User;
