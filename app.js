const express = require("express");
const mongoose = require("mongoose");
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
  })
  .then(() => {
    console.log("DB connected");
  });

const PORT = process.env.PORT || 8000;

// routes middleware
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
