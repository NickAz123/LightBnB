INSERT INTO users (name, email, password)
VALUES ('Harrison Ford', 'harrytheford@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Carrie Fisher', 'carrieme@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Mark Hamilton', 'iamyourfather@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES ('Speed Lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 900, 1, 3, 3, 'Canada', '3352 Namsub Highway', 'Sotboske', 'Quebec', '28142', TRUE),
('Blank Corner', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 8200, 6, 5, 9, 'Canada', '652 Fake Way', 'Rotunf', 'Newfoundland', '76729', TRUE),
('Habit Mix', 'description', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 6772, 1, 5, 3, 'Canada', '67 Green Way', 'Toronto', 'Ontario', '276V2', TRUE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES('2018-09-11', '2018-09-18', 1, 3),
('2021-03-10', '2021-03-30', 2, 1),
('2014-07-01', '2014-07-15', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 1, 1, 8, 'message'),
(1, 2, 2, 4, 'message'),
(2, 3, 2, 10, 'message');
