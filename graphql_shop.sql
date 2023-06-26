SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `categories` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT 'http://localhost:4000/images/users/user.jpg',
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `items` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `category_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `detail` varchar(500) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `orders` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `buyer_id` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  FOREIGN KEY (buyer_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_items` (
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`order_id`, `item_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
  FOREIGN KEY (`item_id`) REFERENCES `items`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`name`) VALUES
('Cat'),
('Dog'),
('Rabbit'),
('Bird'),
('Fish');

INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('admin', 'admin@gmail.com', 'admin', 'admin');

INSERT INTO `users` (`name`, `email`, `password`) VALUES
('user1', 'user1@gmail.com', 'user1'),
('user2', 'user2@gmail.com', 'user2');

INSERT INTO `items` (`name`, `category_id`, `seller_id`, `detail`, `image`, `price`) VALUES
('First Cat', 1, 2, 'meow meow', 'http://localhost:4000/images/items/1.jpg', '1000'),
('Second Cat', 1, 2, 'meow!', 'http://localhost:4000/images/items/2.jpg', '2000'),
('Third Cat', 1, 3, 'meoooooooow', 'http://localhost:4000/images/items/3.jpg', '1500'),
('Fourth Cat', 1, 3, 'meow meow meow!', 'http://localhost:4000/images/items/4.jpg', '1000'),
('Fifth Cat', 1, 2, 'meooooooooow meow!', 'http://localhost:4000/images/items/5.jpg', '2500');

COMMIT;
