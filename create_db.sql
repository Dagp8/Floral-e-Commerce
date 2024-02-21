CREATE DATABASE myshop;
USE myshop;


CREATE USER 'shopapp'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qwerty';
GRANT ALL PRIVILEGES ON myshop.* TO 'shopapp'@'localhost';   


CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL
);


CREATE TABLE flowers (
    flowerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(5, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(255),
    stock_quantity INT NOT NULL DEFAULT 0
);


CREATE TABLE orders (
    orderId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    shipping_address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE order_details (
    orderDetailId INT AUTO_INCREMENT PRIMARY KEY,
    orderId INT NOT NULL,
    flowerId INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
    FOREIGN KEY (flowerId) REFERENCES flowers(flowerId)
);


CREATE TABLE flower_offers (
    offerId INT AUTO_INCREMENT PRIMARY KEY,
    flowerId INT,
    discount DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (flowerId) REFERENCES flowers(flowerId)
);



CREATE TABLE store_comments (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
