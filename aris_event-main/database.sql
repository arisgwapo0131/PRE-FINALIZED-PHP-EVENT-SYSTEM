-- Event Management System Database Schema
-- Drop database if exists and create new one
DROP DATABASE IF EXISTS event_management;
CREATE DATABASE event_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_management;

-- Users table
CREATE TABLE event_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'faculty', 'admin') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE event_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT,
    organizer VARCHAR(50) NOT NULL,
    organizer_name VARCHAR(100) NOT NULL,
    category ENUM('Academic', 'Sports', 'Cultural', 'Workshop', 'General') NOT NULL,
    capacity INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    budget DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer) REFERENCES event_users(username) ON DELETE CASCADE,
    INDEX idx_event_id (event_id),
    INDEX idx_status (status),
    INDEX idx_date (date),
    INDEX idx_organizer (organizer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Registrations table
CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_id VARCHAR(50) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES event_users(username) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volunteers table
CREATE TABLE event_volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vol_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    task VARCHAR(200) NOT NULL,
    assigned_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_by) REFERENCES event_users(username) ON DELETE CASCADE,
    INDEX idx_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resources table
CREATE TABLE event_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    res_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('Equipment', 'Supplies', 'Furniture', 'AV/Tech') NOT NULL,
    qty INT NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    added_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES event_users(username) ON DELETE CASCADE,
    INDEX idx_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Venues table
CREATE TABLE event_venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venue_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    capacity INT NOT NULL,
    reserved_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserved_by) REFERENCES event_users(username) ON DELETE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feedback table
CREATE TABLE event_feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fb_id VARCHAR(50) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    text TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES event_users(username) ON DELETE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Announcements table
CREATE TABLE event_announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ann_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    priority ENUM('normal', 'important', 'urgent') DEFAULT 'normal',
    audience ENUM('all', 'students', 'faculty') DEFAULT 'all',
    expiry DATE NULL,
    body TEXT NOT NULL,
    posted_by VARCHAR(100) NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audience (audience),
    INDEX idx_priority (priority),
    INDEX idx_posted_at (posted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default users
INSERT INTO event_users (username, password, role, name, email, status) VALUES
('student', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'John Student', 'student@uni.edu', 'active'),
('student2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Maria Santos', 'student2@uni.edu', 'active'),
('faculty', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'faculty', 'Dr. Jane Faculty', 'faculty@uni.edu', 'active'),
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin User', 'admin@uni.edu', 'active');

-- Insert sample events
INSERT INTO event_events (event_id, title, date, time, location, description, organizer, organizer_name, category, capacity, status, budget, created_at) VALUES
('evt_001', 'Annual Tech Summit 2026', '2026-03-15', '09:00:00', 'Main Auditorium', 'A comprehensive summit on the latest technology trends.', 'faculty', 'Dr. Jane Faculty', 'Academic', 500, 'approved', 50000.00, '2026-02-01 00:00:00'),
('evt_002', 'Campus Fun Run 5K', '2026-03-22', '06:00:00', 'Campus Grounds', 'Join us for a fun community run around campus.', 'faculty', 'Dr. Jane Faculty', 'Sports', 200, 'approved', 20000.00, '2026-02-05 00:00:00'),
('evt_003', 'Cultural Night 2026', '2026-04-10', '18:00:00', 'University Theater', 'Celebrate diversity with student performances.', 'faculty', 'Dr. Jane Faculty', 'Cultural', 300, 'approved', 35000.00, '2026-02-10 00:00:00');
