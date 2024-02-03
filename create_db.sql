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
    category VARCHAR(255)
);


CREATE TABLE flower_offers (
    offerId INT AUTO_INCREMENT PRIMARY KEY,
    flowerId INT,
    discount DECIMAL(5, 2) NOT NULL,
    FOREIGN KEY (flowerId) REFERENCES flowers(flowerId)
);


CREATE TABLE CartItems (
    cartItemId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    flowerId INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (flowerId) REFERENCES flowers(flowerId)
);

CREATE TABLE store_comments (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    comment_text TEXT NOT NULL,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
