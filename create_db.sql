CREATE DATABASE myshop;
USE myshop;

CREATE TABLE flowers (
    id INT AUTO_INCREMENT,
    name VARCHAR(50),
    price DECIMAL(5, 2) unsigned,
    PRIMARY KEY(id));

CREATE USER 'shopapp'@'localhost' IDENTIFIED WITH mysql_native_password BY 'qwerty';
GRANT ALL PRIVILEGES ON myshop.* TO 'shopapp'@'localhost';   

INSERT INTO flowers (name, price)
VALUES('25 Ecuadorian Roses', 55.00),('20 Orange Roses', 29.90), ('Inspiration Bouquet', 58.90) ;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL
);