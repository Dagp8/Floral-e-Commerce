 INSERT INTO flowers (name, price, image_url)
 VALUES ('25 Ecuadorian Roses', 55.00, '/images/rosas-ecu.jpeg'),
        ('20 Orange Roses', 29.90, '/images/rosas-naranjas.jpeg'),
        ('Inspiration Bouquet', 58.90, '/images/inspiration.jpg');

INSERT INTO flower_offers (flowerId, discount) VALUES (1, 2.00);
INSERT INTO flower_offers (flowerId, discount) VALUES (2, 1.50);

/* last into with category*/

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Pink Roses', 39.99, '/images/pink.jpeg', 'Ecuadorian');
