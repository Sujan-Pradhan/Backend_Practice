const express = require("express");
require("dotenv").config();

//Require body parser to post
const bodyParser = require("body-parser");

//require express-validator for validation
const expressValidator = require("express-validator");

const cookieParser = require("cookie-parser");

const app = express();

//database importing
const DB = require("./database/connection");

//Importing routes
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");

//middleware
app.use(bodyParser.json());
app.use(expressValidator());
app.use("/public/uploads", express.static("public/uploads"));
app.use(cookieParser());

//routes
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", authRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
