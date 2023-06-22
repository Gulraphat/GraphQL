SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `detail` varchar(500) NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;
COMMIT;