const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// info DOTENV FILE ACCESS
const DB = process.env.DB;
const PORT = process.env.PORT;

// comments :- CONNECTION WITH MONGODB ATLAS
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`connection successful in ${PORT} port`);
  })
  .catch((err) => {
    console.log(err.message);
  });
