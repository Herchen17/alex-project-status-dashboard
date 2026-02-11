-- Medical Clinic Database Schema
-- Gold Coast Medical Clinic Database Project

-- Create database if not exists
-- CREATE DATABASE IF NOT EXISTS medical_clinics;
-- USE medical_clinics;

-- Main medical clinics table
CREATE TABLE IF NOT EXISTS medical_clinics (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    
    -- Address components
    address_street VARCHAR(500) NOT NULL,
    address_suburb VARCHAR(100) NOT NULL,
    address_state VARCHAR(50) NOT NULL DEFAULT 'QLD',
    address_postcode VARCHAR(10) NOT NULL,
    address_latitude DECIMAL(10, 8) NULL,
    address_longitude DECIMAL(11, 8) NULL,
    
    -- Contact information
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    website VARCHAR(500) NULL,
    
    -- Business metrics
    ui_rating INTEGER NOT NULL CHECK (ui_rating >= 1 AND ui_rating <= 5),
    staff_count INTEGER NOT NULL CHECK (staff_count >= 1),
    practice_type ENUM('GP', 'Specialist', 'Medical Centre', 'Allied Health', 'Other') NOT NULL,
    established_year INTEGER NULL CHECK (established_year >= 1800 AND established_year <= YEAR(CURDATE())),
    
    -- Metadata
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_suburb (address_suburb),
    INDEX idx_practice_type (practice_type),
    INDEX idx_ui_rating (ui_rating),
    INDEX idx_staff_count (staff_count),
    INDEX idx_postcode (address_postcode)
);

-- Specialties table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS specialties (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- Junction table for clinic-specialty relationships
CREATE TABLE IF NOT EXISTS clinic_specialties (
    clinic_id VARCHAR(36) NOT NULL,
    specialty_id INTEGER NOT NULL,
    PRIMARY KEY (clinic_id, specialty_id),
    FOREIGN KEY (clinic_id) REFERENCES medical_clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE
);

-- Decision makers / contacts table
CREATE TABLE IF NOT EXISTS decision_makers (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    clinic_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('Practice Manager', 'Owner', 'Director', 'Administrator', 'Other') NOT NULL,
    phone VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (clinic_id) REFERENCES medical_clinics(id) ON DELETE CASCADE,
    INDEX idx_clinic_id (clinic_id),
    INDEX idx_role (role),
    INDEX idx_primary (is_primary)
);

-- Operating hours table
CREATE TABLE IF NOT EXISTS operating_hours (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    clinic_id VARCHAR(36) NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    hours VARCHAR(50) NOT NULL, -- e.g., "9:00-17:00", "Closed", "9:00-12:00,14:00-18:00"
    
    FOREIGN KEY (clinic_id) REFERENCES medical_clinics(id) ON DELETE CASCADE,
    UNIQUE KEY unique_clinic_day (clinic_id, day_of_week),
    INDEX idx_clinic_id (clinic_id)
);

-- Insert common specialties
INSERT IGNORE INTO specialties (name, category) VALUES
-- General Practice
('General Practice', 'Primary Care'),
('Family Medicine', 'Primary Care'),

-- Medical Specialties
('Cardiology', 'Medical'),
('Dermatology', 'Medical'),
('Endocrinology', 'Medical'),
('Gastroenterology', 'Medical'),
('Geriatrics', 'Medical'),
('Neurology', 'Medical'),
('Oncology', 'Medical'),
('Respiratory Medicine', 'Medical'),
('Rheumatology', 'Medical'),

-- Surgical Specialties
('General Surgery', 'Surgical'),
('Orthopaedic Surgery', 'Surgical'),
('Plastic Surgery', 'Surgical'),
('Vascular Surgery', 'Surgical'),

-- Women\'s Health
('Obstetrics and Gynaecology', 'Womens Health'),
('Fertility Services', 'Womens Health'),

-- Mental Health
('Psychiatry', 'Mental Health'),
('Psychology', 'Mental Health'),

-- Allied Health
('Physiotherapy', 'Allied Health'),
('Occupational Therapy', 'Allied Health'),
('Podiatry', 'Allied Health'),
('Dietetics', 'Allied Health'),
('Speech Pathology', 'Allied Health'),

-- Other
('Pathology', 'Diagnostic'),
('Radiology', 'Diagnostic'),
('Pharmacy', 'Other'),
('Optometry', 'Other'),
('Dentistry', 'Other');