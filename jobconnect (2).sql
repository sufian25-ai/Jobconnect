-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 19, 2025 at 08:54 PM
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
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `resume_path` varchar(255) NOT NULL,
  `cover_letter` text DEFAULT NULL,
  `status` enum('pending','reviewed','shortlisted','rejected','hired') DEFAULT 'pending',
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `job_id`, `user_id`, `name`, `email`, `phone`, `resume_path`, `cover_letter`, `status`, `applied_at`, `updated_at`) VALUES
(1, 11, 1, 'Mahbub', 'msufianbd92@gmail.com', '01568393086', 'uploads/resumes/resume_1755574680_2665.pdf', 'dscvdscv', 'hired', '2025-08-19 03:38:00', '2025-08-19 05:24:31'),
(2, 10, 18, 'Ripon', 'Ripon@gmail.com', '01752548992', 'uploads/resumes/resume_1755581360_3156.pdf', '', 'pending', '2025-08-19 05:29:20', NULL),
(3, 12, 18, 'Ripon', 'Ripon@gmail.com', '01752548992', 'uploads/resumes/resume_1755585765_6746.pdf', 'fgbfdgfd', 'shortlisted', '2025-08-19 06:42:45', '2025-08-19 06:43:16'),
(4, 19, 1, 'Mahbub', 'msufianbd92@gmail.com', '01752548992', 'uploads/resumes/resume_1755625760_3695.pdf', 'I need this job', 'hired', '2025-08-19 17:49:20', '2025-08-19 18:05:38');

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `total_salary` decimal(10,2) NOT NULL,
  `admin_commission` decimal(10,2) NOT NULL,
  `status` enum('pending','paid') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commissions`
--

INSERT INTO `commissions` (`id`, `company_id`, `user_id`, `job_id`, `total_salary`, `admin_commission`, `status`, `created_at`) VALUES
(1, 4, 1, 19, 14999.00, 1499.90, 'paid', '2025-08-19 18:05:38');

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
(1, 3, 'Technology', 'msufianbd99@gmail.com', '01752548992', 'Gulshan ', 'Dhaka', '2000', 'fi ggfhygyg hfgg', '', '', '689d568274f1e_modern_hexagon_tech_logo_designs_concept_hexa_technology_logo_template_vector.jpg', '689d55f41c6eb_10981439_4582455.jpg', '1000+', 'dsgjhvj ', 'asdjgjs sfdsf ', 'gsdhsajgdjs', '2025-08-13 16:46:42', '2025-08-14 03:24:37'),
(4, 19, 'Daraz', 'xehad@gmail.com', '01752548992', 'Gulshan Dhaka', 'Dhaka', '2008', NULL, 'https://www.daraz.com.bd', NULL, '68a49ebb5a3b3_b605086c_4780_4060_a2b7_ff3709c6a28f.png', '68a49ec00a2cc_0ef9e5ee4aee8bdfca32c3632476f42a.jpg_2200x2200q80.jpg', '1000+', NULL, NULL, NULL, '2025-08-19 15:56:43', '2025-08-19 16:06:08');

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
(7, 1, 'jobconnect', '689cc1cbe0763_student_id.jpg', 'Engineer', 'outstanding', 'Barisal', 'Full-time', 60000.00, '2025-08-16', '2025-08-14 01:58:00', '2025-08-14 01:58:00', 'pending'),
(8, 1, 'Technology', '689d568274f1e_modern_hexagon_tech_logo_designs_concept_hexa_technology_logo_template_vector.jpg', 'Hr Maneger', 'Post Gradute From Marketting', 'Polton', 'Internship', 20000.00, '2025-08-23', '2025-08-14 03:44:52', '2025-08-14 03:44:52', 'pending'),
(9, 1, 'Technology', '689d568274f1e_modern_hexagon_tech_logo_designs_concept_hexa_technology_logo_template_vector.jpg', 'Project Manager', '5 years exprience', 'Gulshan', 'Full-time', 65000.00, '2025-08-15', '2025-08-14 07:02:35', '2025-08-19 03:32:53', 'rejected'),
(10, 1, 'Technology', '689d568274f1e_modern_hexagon_tech_logo_designs_concept_hexa_technology_logo_template_vector.jpg', 'Software Engnieer', 'Outstanding', 'Sylet', 'Remote', 15000.00, '2025-08-21', '2025-08-18 03:38:11', '2025-08-19 06:01:08', 'rejected'),
(11, 1, 'Technology', '689d568274f1e_modern_hexagon_tech_logo_designs_concept_hexa_technology_logo_template_vector.jpg', 'Lecturer', '2 years Exprience', 'Sylet', 'Full-time', 25000.00, '2025-08-22', '2025-08-19 03:22:59', '2025-08-19 03:32:06', 'approved'),
(12, 1, 'Technology', '689d568274f1e_modern_hexagon_tech_logo_designs_concept_hexa_technology_logo_template_vector.jpg', 'Marketting', '4 Years ex', 'Barisal', '', 15000.00, '2025-08-29', '2025-08-19 06:36:15', '2025-08-19 06:44:30', 'approved'),
(19, 4, 'Daraz', '68a49ebb5a3b3_b605086c_4780_4060_a2b7_ff3709c6a28f.png', 'Marketting', 'No Exprience', 'Khulna', '', 14999.00, '2025-08-22', '2025-08-19 16:02:53', '2025-08-19 16:04:41', 'approved');

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
(1, 'Mahbub', 'msufianbd92@gmail.com', '$2y$10$uVHiiA94QHsKAdyS/yZsxOuLUVLgdBz8pX7ANMrF9VeOvaDJvJz6e', 'user', NULL, NULL, NULL, NULL, NULL, NULL, 'https://www.linkedin.com/sufian', 'https://github.com/sufian25-ai', 'https://msufian.xyz/', '1755154694_sufiancroppedpdfresizer.com.pdf', '1755143399_sufian.jpg'),
(3, 'sufian', 'msufianbd99@gmail.com', '$2y$10$bekFRbmasc/Sktg1jLyR1ewRebcoGYSUrRd/i/TPCFpgTcISCDAuu', 'company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 'dgdgs ', 'dgdgs@gmail.com', '$2y$10$CHBL7ViKyNyC9bkfJaffke9ZZM7ZHRoKUjqMuDZ6DBZphqmvZ1aT.', 'company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'Test User', 'test@gmail.com', '$2y$10$dd.GAryy6b8kKx2cZ8FwTuh0fZHYcs1lx4eTE9wl2cPhgZmIdFJSu', 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'Admin', 'admin@gmail.com', '$2y$10$o/PNuGUnm3IEt386oYxe5.XQLB8UKFY1axb8RuSr5Ffo1nfP3U766', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'Ripon', 'Ripon@gmail.com', '$2y$10$lFj9LM9Io3949S6iuubpjO7r3BZkHsSSls84nguGaVHciIAr255zK', 'user', '01752548992', 'Uttar fashion,Osmangonj, charfashion, Bhola', ' nbv', ' bnvn', ' bnv', 'nhjm nb ', NULL, NULL, NULL, '1754984359_ReactJSIsDBExamSuggestion1.pdf', '1755581334_alone-boy-6129399_640.jpg'),
(19, 'xehad', 'xehad@gmail.com', '$2y$10$NLEAPXaI/Ic05Q2bniLGOeyF9Rrbglmkwa.mVG/c2y3KEIy/Omw7m', 'company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comm_company` (`company_id`),
  ADD KEY `fk_comm_user` (`user_id`),
  ADD KEY `fk_comm_job` (`job_id`);

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
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user_profiles`
--
ALTER TABLE `user_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `fk_comm_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comm_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
