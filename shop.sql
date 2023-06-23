SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `category_id` int(11) NOT NULL,
  `detail` varchar(500) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO `categories` (`name`) VALUES
('Cat'),
('Dog'),
('Rabbit'),
('Bird'),
('Fish');

INSERT INTO `items` (`name`, `category_id`, `detail`, `image`, `price`) VALUES
('First Cat', 1, 'meow meow', 'http://localhost:4000/image/1.jpg', '1000'),
('Second Cat', 1, 'meow!', 'http://localhost:4000/image/2.jpg', '2000'),
('Third Cat', 1, 'meoooooooow', 'http://localhost:4000/image/3.jpg', '1500'),
('Fourth Cat', 1, 'meow meow meow!', 'http://localhost:4000/image/4.jpg', '1000'),
('Fifth Cat', 1, 'meooooooooow meow!', 'http://localhost:4000/image/5.jpg', '2500');

COMMIT;
