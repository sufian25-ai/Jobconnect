-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2025 at 03:58 AM
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
-- Database: `jobconnect`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `founded` varchar(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `employees` varchar(20) DEFAULT NULL,
  `products` text DEFAULT NULL,
  `services` text DEFAULT NULL,
  `achievements` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `name`, `email`, `phone`, `address`, `industry`, `founded`, `description`, `website`, `linkedin`, `logo`, `banner`, `employees`, `products`, `services`, `achievements`, `created_at`, `updated_at`) VALUES
(1, 3, 'jobconnect', 'msufianbd99@gmail.com', '01752548992', '', 'yfuytft', '2000', '', '', '', '689cc1cbe0763_student_id.jpg', '689cc1bd74ef1_registration.JPG', '1000+', '', '', '', '2025-08-13 16:46:42', '2025-08-13 16:48:27');

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `submitted_at` datetime NOT NULL,
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `name`, `email`, `phone`, `subject`, `message`, `submitted_at`, `is_read`) VALUES
(1, 'sufian', 'msufianbd92@gmail.com', '01752548992', 'bcb', 'hgjn ghsd  disagd gsg  dgshhs sdghs', '2025-07-31 12:03:53', 0),
(2, 'sufian', 'msufianbd92@gmail.com', '01752548992', 'bcb', 'c Z jf fff fg fdffadgfagdfgf dfgfgf dfagff', '2025-07-31 12:06:29', 0),
(3, 'টেস্ট নাম', 'test@example.com', '01712345678', 'টেস্ট বিষয়', 'এটি একটি টেস্ট বার্তা', '2025-07-31 12:13:26', 0),
(4, 'sufian', 'msufianbd92@gmail.com', '01752548992', 'bcb', 'cvcxv xcvvx xz c xvxxzvxv xv', '2025-07-31 12:16:03', 0),
(5, 'sufian', 'msufianbd92@gmail.com', '01752548992', 'ckgfv', 'shfh hgfs hsgfjhsg fd g sgjg gsdggshgfhg', '2025-07-31 12:25:45', 0);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `company_logo` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(100) NOT NULL,
  `job_type` enum('Full-time','Part-time','Internship','Remote') DEFAULT 'Full-time',
  `salary` decimal(10,2) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `company_id`, `company_name`, `company_logo`, `title`, `description`, `location`, `job_type`, `salary`, `deadline`, `created_at`, `updated_at`, `status`) VALUES
(1, 3, NULL, NULL, 'Software Engnieer', 'Full Stack', 'Gulshan', 'Full-time', 20000.00, '2025-07-31', '2025-07-29 06:10:00', '2025-07-29 06:48:34', 'approved'),
(2, 3, NULL, NULL, 'Software Engnieer', 'Backend\n', 'Gulshan', 'Full-time', 20000.00, '2025-07-31', '2025-07-29 06:33:21', '2025-07-29 06:33:21', 'pending'),
(3, 3, NULL, NULL, 'Marketting Manager', '4 Years Exprience', 'Kulna', 'Full-time', 15000.00, '2025-08-10', '2025-08-02 05:13:43', '2025-08-02 05:13:43', 'pending'),
(4, 3, NULL, NULL, 'Lecturer', '1 Years Exprience', 'Barisal', 'Full-time', 22000.00, '2025-08-14', '2025-08-02 05:17:18', '2025-08-02 05:17:18', 'pending'),
(5, 3, NULL, NULL, 'IT Specialist', '2 Years Exprience', 'Sylet', 'Full-time', 30000.00, '2025-08-20', '2025-08-02 05:19:16', '2025-08-02 05:19:16', 'pending'),
(6, 3, NULL, NULL, 'Marketing Specialist', 'very good', 'Khulna', 'Remote', 15000.00, '2025-08-06', '2025-08-13 17:05:06', '2025-08-13 17:07:15', 'approved'),
(7, 1, 'jobconnect', '689cc1cbe0763_student_id.jpg', 'Engineer', 'outstanding', 'Barisal', 'Full-time', 60000.00, '2025-08-16', '2025-08-14 01:58:00', '2025-08-14 01:58:00', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','company','admin') DEFAULT 'user',
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `education` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `skills`, `experience`, `education`, `bio`, `linkedin`, `github`, `website`, `resume`, `profile_img`) VALUES
(1, 'Mahbub', 'msufianbd92@gmail.com', '$2y$10$uVHiiA94QHsKAdyS/yZsxOuLUVLgdBz8pX7ANMrF9VeOvaDJvJz6e', 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'sufian', 'msufianbd99@gmail.com', '$2y$10$bekFRbmasc/Sktg1jLyR1ewRebcoGYSUrRd/i/TPCFpgTcISCDAuu', 'company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'dgdgs ', 'dgdgs@gmail.com', '$2y$10$CHBL7ViKyNyC9bkfJaffke9ZZM7ZHRoKUjqMuDZ6DBZphqmvZ1aT.', 'company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'Test User', 'test@gmail.com', '$2y$10$dd.GAryy6b8kKx2cZ8FwTuh0fZHYcs1lx4eTE9wl2cPhgZmIdFJSu', 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'Admin', 'admin@gmail.com', '$2y$10$o/PNuGUnm3IEt386oYxe5.XQLB8UKFY1axb8RuSr5Ffo1nfP3U766', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'Ripon', 'Ripon@gmail.com', '$2y$10$lFj9LM9Io3949S6iuubpjO7r3BZkHsSSls84nguGaVHciIAr255zK', 'user', '01752548992', 'Uttar fashion,Osmangonj, charfashion, Bhola', ' nbv', ' bnvn', ' bnv', 'nhjm nb ', NULL, NULL, NULL, '1754984359_ReactJSIsDBExamSuggestion1.pdf', '1754983570_sufian.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `experience` text DEFAULT NULL,
  `education` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
