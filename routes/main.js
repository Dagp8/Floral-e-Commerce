const bcrypt = require("bcrypt");
const saltRounds = 10;
const { body, validationResult } = require("express-validator");
const stripe = require("stripe")(
  "sk_test_51OlVRnJajxcYGNtisQZ99LiHKfOSnk8kbIivVnbWZ2jJbX9lwhGLBaJt0JWosOBikZ6Q0SfsDGQOJbXumram4YQr00ePGRTqOe"
);

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
    const recentCommentsQuery = `
      SELECT sc.*, u.username
      FROM store_comments sc
      INNER JOIN users u ON sc.user_id = u.user_id
      ORDER BY sc.comment_date DESC
      LIMIT 4; 
    `;

    db.query(recentCommentsQuery, (err, recentComments) => {
      if (err) {
        console.error(err);
        res.redirect("/");
      } else {
        let newData = Object.assign({}, shopData, {
          recentComments: recentComments,
        });

        res.render("home.ejs", newData);
      }
    });
  });

  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  app.get("/faq", function (req, res) {
    res.render("faq.ejs", shopData);
  });

  app.get("/terms", function (req, res) {
    res.render("terms.ejs", shopData);
  });

  app.get("/privacy", function (req, res) {
    res.render("privacy.ejs", shopData);
  });

  app.get("/allflowers", function (req, res) {
    let sqlquery = `
    SELECT
        f.*,
        COALESCE(fo.discount, 0) AS discount
    FROM
        flowers f
    LEFT JOIN
        flower_offers fo ON f.flowerId = fo.flowerId
    WHERE
        f.category IN ('Ecuadorian', 'Tulips', 'Bouquets', 'Special', 'Orchids', 'Hydrangea');
`;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("allflowers.ejs", newData);
      }
    });
  });
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  app.post(
    "/registered",
    [
      body("email").isEmail().withMessage("Invalid email address"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    function (req, res) {
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
    }
  );

  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });

  app.post("/loggedin", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    // Retrieve the hashed password from the database for the given username
    let sqlquery =
      "SELECT user_id, hashedPassword FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).send("Error fetching user data");
      }

      if (result.length === 0) {
        return res.status(404).send("User not found");
      }
      const userId = result[0].user_id;
      const hashedPassword = result[0].hashedPassword;

      // Compare the provided password with the hashed password
      bcrypt.compare(password, hashedPassword, function (err, passwordMatch) {
        if (err) {
          // Handle error
          return res.status(500).send("Error comparing passwords");
        } else if (passwordMatch) {
          // Passwords match - user is authenticated
          // Save user session here, when login is successful
          req.session.userId = userId;
          res.redirect("/dashboard");
        } else {
          // Passwords do not match
          res.status(401).send("Incorrect password");
        }
      });
    });
  });

  app.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        // error, send an error message to the user.
        res.status(500).send("Error logging out. Please try again.");
      } else {
        //  no errors, send a success message and redirect to the home page.
        res.redirect("/");
      }
    });
  });

  app.get("/search-result", function (req, res) {
    // Searching in the database
    let sqlquery = `
      SELECT f.*, fo.discount
      FROM flowers f
      LEFT JOIN flower_offers fo ON f.flowerId = fo.flowerId
      WHERE f.name LIKE ?;
    `;

    // Add '%' at the beginning and end of the search term
    let searchTerm = "%" + req.query.keyword + "%";

    // Execute the SQL query
    db.query(sqlquery, [searchTerm], (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      }

      // Create a new data object with the search results
      let newData = Object.assign({}, shopData, { availableFlowers: result });

      // Render the search results page
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

  app.get("/basket", redirectLogin, function (req, res) {
    const cartItems = req.session.cart || [];
    res.render("basket.ejs", {
      ...shopData,
      cart: cartItems,
      stripePublicKey:
        "pk_test_51OlVRnJajxcYGNtiC3pqYUtRkFXr6zo5swuHdDp49rfN0fPPsAM9GQj2GMIfkLmXr8ACN5iv6PPecTRoBaRxRKRQ00vRd3Kfps",
    });
  });

  app.post("/payment", (req, res) => {
    const subtotal = parseFloat(req.body.subtotal);

    if (isNaN(subtotal) || subtotal <= 0) {
      return res.status(400).send("Invalid subtotal amount");
    }

    if (!req.session.cart || req.session.cart.length === 0) {
      return res.status(400).send("Your cart is empty");
    }

    stripe.charges.create(
      {
        amount: subtotal * 100,
        currency: "gbp",
        source: req.body.stripeToken,
        description: "Payment at Floral Harmony",
      },
      (err, charge) => {
        if (err) {
          console.error(err);
          res.send("Payment error");
        } else {
          // Insert order into orders table
          const userId = req.session.userId;
          const totalAmount = subtotal;
          const paymentMethod = charge.payment_method_details.type;
          const shippingAddress = req.body.shippingAddress;

          const orderQuery =
            "INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) VALUES (?, ?, ?, ?)";
          db.query(
            orderQuery,
            [userId, totalAmount, paymentMethod, shippingAddress],
            (orderErr, orderResult) => {
              if (orderErr) {
                console.error(orderErr);
                return res.send("Error placing order");
              }

              const orderId = orderResult.insertId;

              // Insert order details into order_details table
              const orderDetailsQuery =
                "INSERT INTO order_details (orderId, flowerId, quantity, price) VALUES ?";
              const orderDetailsValues = req.session.cart.map((item) => [
                orderId,
                item.flowerId,
                item.quantity,
                item.price,
              ]);

              db.query(
                orderDetailsQuery,
                [orderDetailsValues],
                (detailsErr, detailsResult) => {
                  if (detailsErr) {
                    console.error(detailsErr);
                    return res.send("Error placing order details");
                  }

                  const cartItems = req.session.cart;

                  // Clear cart after successful order
                  req.session.cart = [];

                  // Update stock for each flower in the cart
                  cartItems.forEach((item) => {
                    const updateStockQuery =
                      "UPDATE flowers SET stock_quantity = stock_quantity - ? WHERE flowerId = ?";
                    db.query(
                      updateStockQuery,
                      [item.quantity, item.flowerId],
                      (updateErr, updateResult) => {
                        if (updateErr) {
                          console.error("Error updating stock:", updateErr);
                        }
                      }
                    );
                  });

                  res.redirect("/dashboard?payment=success");
                }
              );
            }
          );
        }
      }
    );
  });

  app.post("/add-to-cart", function (req, res) {
    // Extract the flowerId from the form submission
    const flowerId = req.body.flowerId;
    const quantity = parseInt(req.body.quantity) || 1;

    // Initialize the cart if it's not already initialized
    req.session.cart = req.session.cart || [];

    // Check if the flower already exists in the cart
    const existingFlowerIndex = req.session.cart.findIndex(
      (item) => item.flowerId === flowerId
    );

    if (existingFlowerIndex !== -1) {
      console.log("Flower already exists in cart. Updating quantity...");
      // If the flower already exists, update its quantity
      req.session.cart[existingFlowerIndex].quantity += quantity;
      res.redirect("/basket");
    } else {
      // If the flower does not exist, get flower information based on flowerId
      let flowerQuery = `
        SELECT f.*, fo.discount
        FROM flowers f
        LEFT JOIN flower_offers fo ON f.flowerId = fo.flowerId
        WHERE f.flowerId = ?;
      `;

      db.query(flowerQuery, [flowerId], (flowerErr, flowerResult) => {
        if (flowerErr) {
          console.error("Error fetching flower information:", flowerErr);
          return res.status(500).send("Error fetching flower information");
        }

        if (flowerResult.length === 0) {
          return res.status(404).send("Flower not found");
        }

        const flowerInfo = flowerResult[0];
        flowerInfo.quantity = quantity;

        // Add the flower information to the cart
        req.session.cart.push(flowerInfo);
        // Redirect to the basket page after adding to the cart
        res.redirect("/basket");
      });
    }
  });

  app.post("/remove-from-cart", function (req, res) {
    const cartIndex = req.body.index;

    if (req.session.cart && req.session.cart.length > cartIndex) {
      req.session.cart.splice(cartIndex, 1);
    }
    res.redirect("/basket");
  });

  // routes for comments

  app.get("/comments", function (req, res) {
    let sqlquery = `
      SELECT sc.*, u.username
      FROM store_comments sc
      INNER JOIN users u ON sc.user_id = u.user_id
      ORDER BY sc.comment_date DESC;
    `;

    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("/");
      } else {
        let newData = Object.assign({}, shopData, {
          availableComments: result,
        });
        res.render("comments.ejs", newData);
      }
    });
  });

  app.get("/add_comments", redirectLogin, function (req, res) {
    let commentsQuery = `
      SELECT sc.*, u.username
      FROM store_comments sc
      INNER JOIN users u ON sc.user_id = u.user_id
      ORDER BY sc.comment_date DESC;
    `;

    db.query(commentsQuery, (err, commentsResult) => {
      if (err) {
        console.error(err);
        res.redirect("/");
      } else {
        let updatedShopData = Object.assign({}, shopData, {
          availableComments: commentsResult,
        });

        res.render("add_comments.ejs", updatedShopData);
      }
    });
  });

  app.post("/add_comments", redirectLogin, function (req, res) {
    const { comment_text } = req.body;
    const user_id = req.session.userId;

    if (!comment_text) {
      res.redirect("/add_comments");
    } else {
      const insertQuery = `
        INSERT INTO store_comments (user_id, comment_text)
        VALUES (?, ?);
      `;

      db.query(insertQuery, [user_id, comment_text], (err, result) => {
        if (err) {
          console.error(err);
          res.redirect("/add_comments");
        } else {
          res.redirect("/comments");
        }
      });
    }
  });

  app.get("/dashboard", redirectLogin, function (req, res) {
    const userId = req.session.userId;

    let ordersQuery = `
      SELECT DISTINCT o.orderId, SUM(od.quantity * f.price) AS total_amount, MAX(o.order_date) AS latest_order_date
      FROM orders o
      INNER JOIN order_details od ON o.orderId = od.orderId
      INNER JOIN flowers f ON od.flowerId = f.flowerId
      WHERE o.user_id = ?
      GROUP BY o.orderId
      ORDER BY latest_order_date DESC;
    `;

    db.query(ordersQuery, [userId], (err, orders) => {
      if (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).send("Error fetching orders");
      }

      const paymentSuccess = req.query.payment === "success";

      res.render("dashboard.ejs", {
        ...shopData,
        orders: orders,
        paymentSuccess: paymentSuccess,
      });
    });
  });

  app.get("/order/:orderId", redirectLogin, function (req, res) {
    const userId = req.session.userId;
    const orderId = req.params.orderId;

    let orderDetailsQuery = `
    SELECT o.*, f.name AS flower_name, f.price AS flower_price,
    od.quantity AS quantity, 
    (od.quantity * f.price) AS subtotal, 
    DATE_FORMAT(o.order_date, '%a %b %e %Y %T') AS formatted_order_date
    FROM orders o
    INNER JOIN order_details od ON o.orderId = od.orderId
    INNER JOIN flowers f ON od.flowerId = f.flowerId
    WHERE o.orderId = ? AND o.user_id = ?;
`;

    db.query(orderDetailsQuery, [orderId, userId], (err, orderDetails) => {
      if (err) {
        console.error("Error fetching order details:", err);
        return res.status(500).send("Error fetching order details");
      }

      if (orderDetails.length === 0) {
        return res.status(404).send("Order not found");
      }

      res.render("order-details.ejs", {
        ...shopData,
        orders: orderDetails,
      });
    });
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
    let sqlquery = `
    SELECT
        f.*,
        COALESCE(fo.discount, 0) AS discount
    FROM
        flowers f
    LEFT JOIN
        flower_offers fo ON f.flowerId = fo.flowerId AND f.category = 'Tulips'
    WHERE
        f.category = 'Tulips';
`;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("tulip.ejs", newData);
      }
    });
  });

  app.get("/bouquet", function (req, res) {
    let sqlquery = `
    SELECT
        f.*,
        COALESCE(fo.discount, 0) AS discount
    FROM
        flowers f
    LEFT JOIN
        flower_offers fo ON f.flowerId = fo.flowerId AND f.category = 'Bouquets'
    WHERE
        f.category = 'Bouquets';
`;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("bouquet.ejs", newData);
      }
    });
  });

  app.get("/special", function (req, res) {
    let sqlquery = `
    SELECT
        f.*,
        COALESCE(fo.discount, 0) AS discount
    FROM
        flowers f
    LEFT JOIN
        flower_offers fo ON f.flowerId = fo.flowerId AND f.category = 'Special'
    WHERE
        f.category = 'Special';
`;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("special.ejs", newData);
      }
    });
  });

  app.get("/orchids", function (req, res) {
    let sqlquery = `
    SELECT
        f.*,
        COALESCE(fo.discount, 0) AS discount
    FROM
        flowers f
    LEFT JOIN
        flower_offers fo ON f.flowerId = fo.flowerId AND f.category = 'Orchids'
    WHERE
        f.category = 'Orchids';
`;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("orchids.ejs", newData);
      }
    });
  });

  app.get("/hydrangea", function (req, res) {
    let sqlquery = `
    SELECT
        f.*,
        COALESCE(fo.discount, 0) AS discount
    FROM
        flowers f
    LEFT JOIN
        flower_offers fo ON f.flowerId = fo.flowerId AND f.category = 'Hydrangea'
    WHERE
        f.category = 'Hydrangea';
`;

    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect("./");
      } else {
        let newData = Object.assign({}, shopData, { availableFlowers: result });
        console.log(newData);
        res.render("hydrangea.ejs", newData);
      }
    });
  });
};
