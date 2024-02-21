 INSERT INTO flowers (name, price, image_url)
 VALUES ('25 Ecuadorian Roses', 55.00, '/images/rosas-ecu.jpeg'),
        ('20 Orange Roses', 29.90, '/images/rosas-naranjas.jpeg'),
        ('Inspiration Bouquet', 58.90, '/images/inspiration.jpg');

INSERT INTO flower_offers (flowerId, discount) VALUES (1, 2.00);
INSERT INTO flower_offers (flowerId, discount) VALUES (2, 1.50);
INSERT INTO flower_offers (flowerId, discount) VALUES (5, 2.50);
INSERT INTO flower_offers (flowerId, discount) VALUES (6, 2.50);

/* last into with category*/

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Pink Roses', 49.99, '/images/pink.jpeg', 'Ecuadorian');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 White Roses', 49.99, '/images/whiteroses.png', 'Ecuadorian');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Mixed Roses', 49.99, '/images/mix_color.jpeg', 'Ecuadorian');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Red and Pink Tulips', 39.99, '/images/tulipan.jpeg', 'Tulips');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Purple Tulips', 39.99, '/images/purple_tulips.jpg', 'Tulips');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Red Tulips', 39.99, '/images/red_tulips.jpg', 'Tulips');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('20 Yellow Tulips', 39.99, '/images/yellow_tulips.jpeg', 'Tulips');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Love Bouquet', 69.99, '/images/red_bouquet.jpg', 'Bouquets'),
       ('Mixed Bouquet', 59.99, '/images/mix_b.jpeg', 'Bouquets');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Roses Bouquet', 79.99, '/images/bouquets.jpeg', 'Bouquets');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Infinite Love ', 59.99, '/images/spetial.jpg', 'Special');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Love ', 69.99, '/images/valentine.jpeg', 'Special'),
       ('Friend ', 49.99, '/images/friend.jpeg', 'Special'),
       ('Condolences ', 45.00, '/images/condolences.jpg', 'Special');
      

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Purple Orchid ', 29.00, '/images/orquidea.jpg', 'Orchids');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Violet Orchid ', 29.00, '/images/violet.jpg', 'Orchids');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('White Orchid ', 29.00, '/images/white.jpg', 'Orchids'),
       ('Cattleya Orchid ', 29.00, '/images/cattleya.jpeg', 'Orchids');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Blue Hydrangea ', 25.00, '/images/hydrangea.jpg', 'Hydrangea');

INSERT INTO flowers (name, price, image_url, category) 
VALUES ('Hydrangea & Roses ', 35.00, '/images/hydra_roses.jpeg', 'Hydrangea'),
       ('Mixed Hydrangea ', 25.00, '/images/mixed_hydra.jpeg', 'Hydrangea'),
       ('White Hydrangea ', 25.00, '/images/white_hydra.jpg', 'Hydrangea');


UPDATE flowers SET stock_quantity = stock_quantity + 50 WHERE category = 'Ecuadorian';
UPDATE flowers SET stock_quantity = stock_quantity + 50 WHERE category = 'Tulips';
UPDATE flowers SET stock_quantity = stock_quantity + 50 WHERE category = 'Bouquets';
UPDATE flowers SET stock_quantity = stock_quantity + 50 WHERE category = 'Special';
UPDATE flowers SET stock_quantity = stock_quantity + 50 WHERE category = 'Orchids';
UPDATE flowers SET stock_quantity = stock_quantity + 50 WHERE category = 'Hydrangea';

