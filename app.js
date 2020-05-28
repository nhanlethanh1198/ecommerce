const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();

// import routes
const userRoutes = require("./routes/user");

// app
const app = express();

// Database
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  });

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

const PORT = process.env.PORT || 8000;

// routes middleware
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
