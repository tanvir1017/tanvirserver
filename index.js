const express = require("express");
const app = express();

// ! PROT & DB DECLARE
const port = process.env.PORT || 1017;

// ! DOTENV FILE REQUIRE
// dotenv.config({ path: "./.env" });
require("dotenv").config();

// info CONNECTING WITH CONN
require("./db/connectionDB");

// ! FILE WITH EXPRESS.JSON()
app.use(express.json());

// @ LINKING WITH ROUTER
app.use(require("./router/auth"));
app.use(require("./router/blog"));

// comments :- MIDDLEWARE
app.get("/", (req, res) => {
  res.send({ message: "hello from home" });
  console.log("hello from home");
});

//comments :-  LISTEN
app.listen(port, async () => {
  console.log(`app listening of port ${port}`);
});
