import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true, // Ensure userName is unique
      index: true, // Create an index on userName
      trim: true, // Remove whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
      trim: true, // Remove whitespace
      lowercase: true, // Convert email to lowercase
    },
    fullName: {
      type: String,
      required: true,
      index: true, // Create an index on fullName
      trim: true, // Remove whitespace
    },
    avatar: {
      type: String, //we will ue CLoudinary URL
      required: true,
    },
    coverImage: {
      type: String, // Store the URL of the cover image
    },
    watcHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
//this is what we write if we want to d something before we save the userData in database
userSchema.pre("save", async function (next) {
  //we use noraml function here rather than the arow function because we cannot work corretly with arrow functin if we use .this keyword
  //here we check that if password is modified only then bycrypt the password otherwise move next
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10); //this.password means the actual password from the databse from above schema
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  //compare returns true or false
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
