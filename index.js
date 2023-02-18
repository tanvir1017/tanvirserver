const express = require("express");
const cors = require("cors");
const app = express();

// ! PROT & DB DECLARE
const port = process.env.PORT || 1017;

// ! DOTENV FILE REQUIRE
// dotenv.config({ path: "./.env" });
require("dotenv").config();

// info CONNECTING WITH CONN
require("./db/connectionDB");

// ! FILE WITH EXPRESS.JSON()
app.use(cors());
app.use(express.json());

// @ LINKING WITH ROUTER
app.use(require("./router/auth"));
app.use(require("./router/blog"));

// comments :- MIDDLEWARE
app.get("/home", (req, res) => {
  res.send({ message: "Hello Sir! Welcome to the server file" });
});

app.post("/register", async (req, res) => {
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

//comments :-  LISTEN
app.listen(port, async () => {
  console.log(`app listening of port ${port}`);
});
