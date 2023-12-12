const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (app, shopData) {
  // Handle routes

  app.get("/", function (req, res) {
    res.render("home.ejs", shopData);
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });

  app.post("/loggedin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Retrieve the hashed password from the database for the given username
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).send("Error fetching user data");
      }

      if (result.length === 0) {
        // User not found
        return res.status(404).send("User not found");
      }

      const hashedPassword = result[0].hashedPassword;

      // Compare the provided password with the hashed password
      bcrypt.compare(password, hashedPassword, function (err, passwordMatch) {
        if (err) {
          // Handle error
          return res.status(500).send("Error comparing passwords");
        } else if (passwordMatch) {
          // Passwords match - user is authenticated
          // Save user session here, when login is successful
          req.session.userId = username;
          res.redirect("/");
        } else {
          // Passwords do not match
          res.status(401).send("Incorrect password");
        }
      });
    });
  });
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  app.post("/registered", function (req, res) {
    const plainPassword = req.body.password;
    // Hash the password using bcrypt
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
      if (err) {
        res.status(500).send("Error hashing password");
      } else {
        // Store the data in your database
        let sqlquery =
          "INSERT INTO users (first_name, last_name, email, username, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        let newpass = [
          req.body.first,
          req.body.last,
          req.body.email,
          req.body.username,
          hashedPassword,
        ];

        db.query(sqlquery, newpass, (err, result) => {
          if (err) {
            console.error("Error saving user data:", err);
            res.status(500).send("Error saving user data");
          } else {
            result =
              "Hello " +
              req.body.first +
              " " +
              req.body.last +
              " you are now registered! We will send an email to you at " +
              req.body.email;
            result +=
              " Your password is: " +
              req.body.password +
              " and your hashed password is: " +
              hashedPassword;

            res.send(result);
          }
        });
      }
    });
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });

  app.get("/search-result", function (req, res) {
    //searching in the database
    let sqlquery =
      "SELECT * FROM flowers WHERE name LIKE '%" + req.query.keyword + "%'";
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableFlowers: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM flowers"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableFlowers: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });
};