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
app.get("/home", (req, res) => {
  res.send({ message: "Hello Sir! Welcome to the server file" });
});

//comments :-  LISTEN
app.listen(port, async () => {
  console.log(`app listening of port ${port}`);
});
