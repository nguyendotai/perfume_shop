-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2025 at 02:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `perfume_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `ten_danh_muc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `ten_danh_muc`) VALUES
(1, 'Nước Hoa Nam'),
(2, 'Nước Hoa Nữ'),
(3, 'Nước Hoa Unisex'),
(4, 'Set Nước Hoa'),
(5, 'Son Môi Mỹ Phẩm Cao Cấp'),
(6, 'Nến'),
(7, 'Sản Phẩm Khác'),
(8, 'Sản Phẩm Nổi Bật'),
(9, 'Chưa Phân Loại');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ngay_dat` datetime DEFAULT current_timestamp(),
  `trang_thai` enum('Đang xử lý','Đã xác nhận','Đang giao','Đã giao','Đã hủy') DEFAULT 'Đang xử lý',
  `tong_tien` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `so_luong` int(11) NOT NULL,
  `gia` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `ten_sp` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `gia` double(10,2) NOT NULL,
  `gia_km` double(10,2) DEFAULT NULL,
  `danh_muc_id` int(11) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `gender` enum('Nam','Nữ','Unisex') DEFAULT NULL,
  `nam_ra_mat` year(4) DEFAULT NULL,
  `nong_do` varchar(255) DEFAULT NULL,
  `phong_cach` varchar(255) DEFAULT NULL,
  `huong_dau` text DEFAULT NULL,
  `huong_giua` text DEFAULT NULL,
  `huong_cuoi` text DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `an_hien` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `ten_sp`, `mo_ta`, `gia`, `gia_km`, `danh_muc_id`, `brand`, `gender`, `nam_ra_mat`, `nong_do`, `phong_cach`, `huong_dau`, `huong_giua`, `huong_cuoi`, `hinh_anh`, `an_hien`) VALUES
(1, 'Paco Rabanne Phantom Gift Set', 'Set nước hoa nam mạnh mẽ', 3800000.00, 2800000.00, 1, 'Paco Rabanne', 'Nam', '2023', 'Eau de Parfum', 'Hiện đại, Nam tính', 'Chanh vàng', 'Hoa oải hương', 'Vani', 'phantom.jpg', 1),
(2, 'Gritti TuTu', 'Nước hoa nữ cao cấp', 7900000.00, 7000000.00, 2, 'Gritti', 'Nữ', '2022', 'Parfum', 'Quyến rũ, Sang trọng', 'Hoa hồng', 'Hoa nhài', 'Gỗ đàn hương', 'gritti_tutu.jpg', 1),
(3, 'Roja Reckless Essence De Parfum 2021', 'Phiên bản giới hạn 2021', 8200000.00, 5750000.00, 3, 'Roja Parfums', 'Unisex', '2021', 'Eau de Parfum', 'Tinh tế, Đẳng cấp', 'Cam bergamot', 'Hoa cam', 'Xạ hương', 'roja_reckless.jpg', 1),
(4, 'Juliette Has A Gun Not A Perfume', 'Hương thơm unisex độc đáo', 2650000.00, NULL, 3, 'Juliette Has A Gun', 'Unisex', '2019', 'Eau de Parfum', 'Tối giản, Tinh tế', 'Ambroxan', NULL, NULL, 'juliette_gun.jpg', 1),
(5, 'YSL Y Intense', 'Nước hoa nam mạnh mẽ, nam tính', 3400000.00, NULL, 1, 'Yves Saint Laurent', 'Nam', '2021', 'Eau de Parfum', 'Lịch lãm, Cuốn hút', 'Cam chanh', 'Gừng', 'Gỗ tuyết tùng', 'ysl_y_intense.jpg', 1),
(6, 'Christian Louboutin Loubiloo Rose Limited', 'Phiên bản giới hạn', 5800000.00, 5000000.00, 2, 'Christian Louboutin', 'Nữ', '2023', 'Parfum', 'Sang trọng, Gợi cảm', 'Quả mâm xôi', 'Hoa hồng', 'Hổ phách', 'loubiloo_rose.jpg', 1),
(7, 'Christian Louboutin Loubicharm Intense', 'Mùi hương quyến rũ', 6500000.00, 5600000.00, 2, 'Christian Louboutin', 'Nữ', '2022', 'Eau de Parfum', 'Gợi cảm, Tinh tế', 'Hoa cam', 'Hoa nhài', 'Gỗ đàn hương', 'loubicharm_intense.jpg', 1),
(8, 'Lalique Ombre Noire', 'Hương gỗ ấm áp', 2700000.00, 2200000.00, 1, 'Lalique', 'Nam', '2020', 'Eau de Toilette', 'Cổ điển, Nam tính', 'Cam chanh', 'Cà phê', 'Hổ phách', 'lalique_ombre.jpg', 1),
(9, 'YSL Libre Flowers & Flames Florale', 'Sang trọng, nữ tính', 3650000.00, 3650000.00, 2, 'Yves Saint Laurent', 'Nữ', '2022', 'Eau de Parfum', 'Tinh tế, Hiện đại', 'Hoa cam', 'Oải hương', 'Xạ hương', 'ysl_libre.jpg', 1),
(10, 'YSL Black Opium Over Red', 'Hương thơm bí ẩn, cuốn hút', 4500000.00, 3450000.00, 2, 'Yves Saint Laurent', 'Nữ', '2023', 'Eau de Parfum', 'Mạnh mẽ, Cá tính', 'Cà phê', 'Hạnh nhân', 'Vani', 'ysl_black_opium.jpg', 1),
(11, 'Lattafa His Confession', 'Hương nam tính, mạnh mẽ', 2200000.00, 1750000.00, 1, 'Lattafa', 'Nam', '2022', 'Eau de Parfum', 'Cuốn hút, Trẻ trung', 'Bạch đàn', 'Hoa oải hương', 'Gỗ đàn hương', 'lattafa_his.jpg', 1),
(12, 'Lattafa Her Confession', 'Hương nữ tính, tinh tế', 2200000.00, 1750000.00, 2, 'Lattafa', 'Nữ', '2022', 'Eau de Parfum', 'Nữ tính, Gợi cảm', 'Cam bergamot', 'Hoa nhài', 'Xạ hương', 'lattafa_her.jpg', 1),
(13, 'Lattafa Khamrah', 'Hương gỗ phương Đông ấm áp', 1300000.00, 1050000.00, 3, 'Lattafa', 'Unisex', '2021', 'Eau de Parfum', 'Nồng nàn, Lôi cuốn', 'Quế', 'Hoa hồng', 'Hổ phách', 'lattafa_khamrah.jpg', 1),
(14, 'Roja Amber Aoud Crystal Parfum', 'Sang trọng, đẳng cấp', 12000000.00, NULL, 3, 'Roja Parfums', 'Unisex', '2020', 'Parfum', 'Sang trọng, Quyền lực', 'Nghệ tây', 'Hoa nhài', 'Gỗ trầm hương', 'roja_amber_aoud.jpg', 1),
(15, 'Roja Elixir Pour Femme', 'Hương thơm quý phái', 9800000.00, 8500000.00, 2, 'Roja Parfums', 'Nữ', '2021', 'Parfum', 'Đẳng cấp, Quyến rũ', 'Hoa cam', 'Hoa hồng', 'Xạ hương', 'roja_elixir.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `dia_chi` text DEFAULT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `danh_muc_id` (`danh_muc_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`danh_muc_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
