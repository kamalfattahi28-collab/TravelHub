-- Database setup for TravelHub
CREATE DATABASE IF NOT EXISTS magellansaudi;
USE magellansaudi;

-- Tourists table
CREATE TABLE IF NOT EXISTS tourists (
    tourist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Guides table
CREATE TABLE IF NOT EXISTS guides (
    guides_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gender ENUM('male', 'female') NOT NULL,
    profile_picture TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tours table
CREATE TABLE IF NOT EXISTS tours (
    tour_id INT AUTO_INCREMENT PRIMARY KEY,
    guides_id INT,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    time TIME NOT NULL,
    tour_date DATE NOT NULL,
    status ENUM('available', 'full', 'cancelled') DEFAULT 'available',
    description TEXT,
    max_participants INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guides_id) REFERENCES guides(guides_id) ON DELETE SET NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    tourist_id INT NOT NULL,
    tour_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    participants INT DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (tourist_id) REFERENCES tourists(tourist_id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('credit_card', 'paypal', 'bank_transfer') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE
);

-- Ratings and Comments table
CREATE TABLE IF NOT EXISTS ratings_comments (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    tourist_id INT NOT NULL,
    tour_id INT,
    guides_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tourist_id) REFERENCES tourists(tourist_id) ON DELETE CASCADE,
    FOREIGN KEY (tour_id) REFERENCES tours(tour_id) ON DELETE CASCADE,
    FOREIGN KEY (guides_id) REFERENCES guides(guides_id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_type ENUM('tourist', 'guide', 'admin') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Resets table
CREATE TABLE IF NOT EXISTS password_resets (
    reset_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licenses table (for guides)
CREATE TABLE IF NOT EXISTS licenses (
    license_id INT AUTO_INCREMENT PRIMARY KEY,
    guides_id INT NOT NULL,
    license_number VARCHAR(255) NOT NULL,
    license_type VARCHAR(100) NOT NULL,
    issued_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    is_valid BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guides_id) REFERENCES guides(guides_id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO tours (title, location, price, duration, time, tour_date, status, description) VALUES
('Historic Riyadh City Tour', 'Riyadh', 150.00, '4 hours', '09:00:00', '2024-02-15', 'available', 'Explore the rich history and culture of Saudi Arabia\'s capital city'),
('Desert Safari Adventure', 'Al Khobar', 200.00, '6 hours', '14:00:00', '2024-02-20', 'available', 'Experience the beauty of the Arabian desert with traditional activities'),
('Jeddah Old Town Walk', 'Jeddah', 120.00, '3 hours', '10:00:00', '2024-02-25', 'available', 'Discover the historic Al-Balad district with its traditional architecture'),
('Mountain Hiking Trip', 'Taif', 180.00, '8 hours', '07:00:00', '2024-03-01', 'available', 'Hike through the beautiful mountains of Taif region'),
('Cultural Heritage Tour', 'Diriyah', 160.00, '5 hours', '11:00:00', '2024-03-05', 'available', 'Visit the UNESCO World Heritage site of Diriyah');

-- Insert a sample admin
INSERT INTO admins (name, email, password_hash, role) VALUES
('Super Admin', 'admin@travelhub.com', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', 'super_admin');
