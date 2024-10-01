const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("This is not valid format of password");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender Data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Not a valid URL");
        }
      },
    },
    about: {
      type: String,
      default: "This is the default about of an user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }

  // createdAt: {
  //   type: Date,
  // },
);
const User = mongoose.model("User", userSchema);

module.exports = User;
