INSERT INTO barbers (name) VALUES ('Carlos'), ('Luis');

-- Lunes a viernes
INSERT INTO barber_availability (barber_id, day_of_week, start_time, end_time)
VALUES
(1, 1, '10:00', '18:00'),
(1, 2, '10:00', '18:00'),
(1, 3, '10:00', '18:00'),
(1, 4, '10:00', '18:00'),
(1, 5, '10:00', '18:00'),

(2, 1, '12:00', '20:00'),
(2, 2, '12:00', '20:00'),
(2, 3, '12:00', '20:00'),
(2, 4, '12:00', '20:00'),
(2, 5, '12:00', '20:00');