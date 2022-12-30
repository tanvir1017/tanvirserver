const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//  ! MONGOOSE SCHEMA
const userSchema = new mongoose.Schema({
  F_name: {
    type: String,
    required: true,
  },
  L_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  P_pic: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// TODO : hashing user password for more security
userSchema.pre("save", async function (next) {
  if (this.isDirectModified("password")) {
    this.password = await bcrypt.hash(this.password, 16);
  }
  next();
});

// todo : generate cookie token
userSchema.methods.generateAuthToken = async function () {
  try {
    let generatedToken = jwt.sign(
      { _id: this._id },
      process.env.SECRET_KEY_JWT
    );
    this.tokens = this.tokens.concat({ token: generatedToken });

    await this.save();
    return generatedToken;
  } catch (error) {
    console.log(error);
  }
};

//! MODEL DEFINE
const User = mongoose.model("USERS", userSchema);
module.exports = User;
