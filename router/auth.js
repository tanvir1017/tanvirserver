const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
require("../db/connectionDB");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  try {
    console.log("connecting....");
    res.status(200).json({
      message: "From the router home page",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// TODO : find all of the users exist in db collection
router.get("/users", async (req, res) => {
  try {
    const totalCountedData = await User.find().countDocuments();
    User.find()
      .then((data) => {
        res.status(200).json({
          success: true,
          message: `Total data founded ${totalCountedData}`,
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: "Something wrong with internal server",
          error: `Failed to find user ${err}`,
        });
      });
  } catch (err) {
    res.status(500).json({ err: `Failed to find user ${err}` });
  }
});

// Todo : Register a new user. If User email exist on the data base then it won't register any user.
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      pictureURL,
      password,
      role,
      createAt,
      rememberMeFor,
    } = req.body;
    if (!firstName || !lastName || !email || !pictureURL || !password) {
      return res.status(422).json({
        message:
          "Please full-fill all the of the requirement that asked to you for register new account",
      });
    } else {
      const existUser = await User.findOne({ email: email });
      const user = new User({
        firstName,
        lastName,
        email,
        pictureURL,
        password,
        role,
        createAt,
      });

      if (existUser) {
        return res.status(422).json({
          success: false,
          message: `user already have an account with this email ID: ${email} `,
        });
      } else {
        const isRegister = await user.save();
        if (isRegister) {
          const token = await isRegister.generateAuthToken();
          res.cookie("authToken", token, {
            expires: new Date(
              Date.now() + rememberMeFor ? rememberMeFor : 2592000
            ),
            httpOnly: true,
          });
          return res.status(201).json({
            success: true,
            message: `account created successful`,
            data: user,
          });
        } else {
          return res.status(500).json({
            success: false,
            message: `user register failed try again a while`,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({
      message: `Internal server error with the code 500 and ${error.message}`,
    });
  }
});
// TODO : Login with your account
router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        message: "Please full-fill the required field",
      });
    }
    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
      return res.status(400).json({
        message: `wrong credential`,
      });
    } else {
      // todo : password decode by bcryptjs
      const checkPass = await bcrypt.compare(password, userInfo.password);
      // todo : cookie set
      const token = await userInfo.generateAuthToken();
      res.cookie("authToken", token, {
        expires: new Date(Date.now() + 2592000),
        httpOnly: true,
      });
      if (!checkPass) {
        return res.status(400).json({
          message: `wrong credential`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "user sign-in successfully",
          data: userInfo,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: `internal server error with this error:- ${error}`,
    });
  }
});

module.exports = router;
