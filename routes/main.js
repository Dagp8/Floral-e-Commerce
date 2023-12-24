const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = function (app, shopData) {
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect("./login");
    } else {
      next();
    }
  };
  // Handle routes

  app.get("/", function (req, res) {
    res.render("home.ejs", shopData);
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  app.get("/ecuaflor", function (req, res) {
    let sqlquery = `
        SELECT
            f.*,
            COALESCE(fo.discount, 0) AS discount
        FROM
            flowers f
        LEFT JOIN
            flower_offers fo ON f.flowerId = fo.flowerId AND f.category = 'Ecuadorian'
        WHERE
            f.category = 'Ecuadorian';
    `;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("ecuaflor.ejs", newData);
      }
    });
  });

  app.get("/tulip", function (req, res) {
    res.render("tulip.ejs", shopData);
  });

  app.get("/bouquet", function (req, res) {
    res.render("bouquet.ejs", shopData);
  });

  app.get("/spetial", function (req, res) {
    res.render("spetial.ejs", shopData);
  });

  app.get("/orchids", function (req, res) {
    res.render("orchids.ejs", shopData);
  });

  app.get("/hydrangea", function (req, res) {
    res.render("hydrangea.ejs", shopData);
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
            res.render("login.ejs", shopData);
          }
        });
      }
    });
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
    let sqlquery = `
    SELECT
      f.*,
      fo.discount
    FROM
      flowers f
    INNER JOIN
      flower_offers fo
    ON
      f.flowerId = fo.flowerId
  `;
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

  app.get("/basket", function (req, res) {
    const cartItems = req.session.cart || [];
    res.render("basket.ejs", {
      ...shopData,
      cart: cartItems,
    });
  });

  app.post("/add-to-cart", redirectLogin, function (req, res) {
    // Extract the flowerId from the form submission
    const flowerId = req.body.flowerId;
    const userId = req.session.userId;

    // get flower information based on flowerId
    let flowerQuery = "SELECT * FROM flowers WHERE flowerId = ?";
    db.query(flowerQuery, [flowerId], (flowerErr, flowerResult) => {
      if (flowerErr) {
        console.error("Error fetching flower information:", flowerErr);
        return res.status(500).send("Error fetching flower information");
      }

      if (flowerResult.length === 0) {
        return res.status(404).send("Flower not found");
      }

      const flowerInfo = flowerResult[0];

      // query to insert the cart item into CartItems table
      let cartQuery = "INSERT INTO CartItems (user_id, flowerId) VALUES (?, ?)";
      db.query(cartQuery, [userId, flowerId], (cartErr, cartResult) => {
        if (cartErr) {
          console.error("Error adding to cart:", cartErr);
          return res.status(500).send("Error adding to cart");
        }

        // Store the flower information in the user's cart in the session
        req.session.cart = req.session.cart || [];
        req.session.cart.push(flowerInfo);

        // Redirect basket page after adding to the cart
        res.redirect("/basket");
      });
    });
  });
};
