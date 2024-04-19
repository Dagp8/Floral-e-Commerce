//Import modules
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
const mysql = require("mysql");
var session = require("express-session");

//Create the express application object
const app = express();
const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));

//Create a session
app.use(
  session({
    secret: "somerandom",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// Set up css
app.use(express.static(__dirname + "/public"));

// Define the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "shopapp",
  password: "qwerty",
  database: "myshop",
});
// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

//Set express directory
//_dirname will get current directory
app.set("views", __dirname + "/views");

//tell express use EJS as a engine
app.set("view engine", "ejs");

// tell express process html files and use ejs rendering engine
app.engine("html", ejs.renderFile);

//Define our data
var shopData = { shopName: "Floral Harmony" };

//Requires main.js all the routes will go in this file
require("./routes/main")(app, shopData);

// Start the web app listening
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!'
`)
);
