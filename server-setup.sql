-- SCHEMA SETUP 
CREATE TABLE driver (
  driver_id INT AUTO_INCREMENT PRIMARY KEY,
  license_number VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  sex ENUM('M', 'F') NOT NULL,
  address TEXT
);

CREATE TABLE vehicle (
  vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
  plate_no VARCHAR(10) UNIQUE NOT NULL,
  engine_no VARCHAR(20) UNIQUE NOT NULL,
  chassis_no VARCHAR(20) UNIQUE NOT NULL,
  vehicle_type VARCHAR(100),
  make VARCHAR(100),
  model VARCHAR(100),
  manufacture_yr YEAR,
  color VARCHAR(50),
  driver_id INT,
  CONSTRAINT vehicle_driver_id_fk FOREIGN KEY (driver_id) 
    REFERENCES driver (driver_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE vehicleRegistration (
  vehicle_reg_id INT AUTO_INCREMENT PRIMARY KEY,
  registration_no VARCHAR(9) UNIQUE NOT NULL,
  registration_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  registration_status ENUM ('active', 'expired', 'suspended') NOT NULL,
  vehicle_id INT NOT NULL,
  CONSTRAINT fk_reg_vehicle_id FOREIGN KEY (vehicle_id) 
    REFERENCES vehicle (vehicle_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE license (
  issue_id INT PRIMARY KEY AUTO_INCREMENT,
  license_issuance_date DATE NOT NULL,
  license_expiration_date DATE NOT NULL,
  license_status ENUM('Valid', 'Expired', 'Suspended', 'Revoked') NOT NULL DEFAULT 'Valid',
  license_type ENUM('Student Permit', 'Non-Professional', 'Professional') NOT NULL,
  driver_id INT NOT NULL,
  CONSTRAINT fk_license_driver_id FOREIGN KEY (driver_id) 
    REFERENCES driver(driver_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_license_dates CHECK (license_expiration_date > license_issuance_date)
);

CREATE TABLE traffic_violation (
  violation_id INT AUTO_INCREMENT PRIMARY KEY,
  violation_type VARCHAR(100) NOT NULL,
  violation_date_time DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  fine_amount DECIMAL(10, 2) NOT NULL,
  violation_status ENUM('unpaid', 'paid', 'contested') DEFAULT 'unpaid',
  officer_name VARCHAR(255),
  driver_id INT NOT NULL,
  vehicle_id INT,
  CONSTRAINT fk_violation_driver FOREIGN KEY (driver_id) REFERENCES driver(driver_id) ON DELETE CASCADE,
  CONSTRAINT fk_violation_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id) ON DELETE SET NULL
);

-- DUMMY DATA
START TRANSACTION;

INSERT INTO driver (license_number, full_name, date_of_birth, sex, address) VALUES
('N01-15-000001', 'Juan Dela Cruz', '2000-12-06', 'M', 'Ruby St. Batong Malake, Los Baños, Laguna'),
('N01-15-000002', 'John Weak', '2001-12-06', 'M', 'Tandang Sora, Quezon City, Metro Manila'),
('N01-15-000003', 'Maria Go', '2002-12-06', 'F', 'San Miguel, Pasig City, Metro Manila');

INSERT INTO license (license_issuance_date, license_expiration_date, license_status, license_type, driver_id) VALUES
('2023-01-10', '2033-01-10', 'Valid', 'Professional', 1),
('2024-06-01', '2029-06-01', 'Valid', 'Student Permit', 2),
('2015-05-20', '2020-05-20', 'Expired', 'Professional', 3);

INSERT INTO vehicle (plate_no, engine_no, chassis_no, vehicle_type, make, model, manufacture_yr, color, driver_id) VALUES
('JVA1206', '52WVC10338', 'JHMCA514XPS001234', 'Private Car', 'Toyota', 'Vios', 2010, 'Gold', 1),
('JCC1206', '53WVC10338', 'JHMCB514XPS001234', 'Private Car', 'Mitsubishi', 'Xpander', 2019, 'Quartz White Pearl', 2);

INSERT INTO vehicleRegistration (registration_no, registration_date, expiration_date, registration_status, vehicle_id) VALUES
("100000001", '2025-01-01', '2026-01-01', 'active', 1),
("100000002", '2023-01-01', '2024-01-01', 'expired', 2);

INSERT INTO traffic_violation (violation_type, violation_date_time, location, fine_amount, violation_status, officer_name, driver_id, vehicle_id) VALUES
('Overspeeding', '2025-03-01 14:30:00', 'SLEX, Manila', 2000.00, 'unpaid', 'Sgt. Dalisay', 1, 1);

COMMIT;

-- REPORTS TO BE GENERATED

-- View all registered drivers filtered by: License type, License status, Age range, Sex
SELECT d.*, l.license_type, l.license_status
FROM driver d
JOIN license l ON d.driver_id = l.driver_id
WHERE l.license_type = 'Professional' 
  AND l.license_status = 'Valid'
  AND d.sex = 'M'
  AND TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) BETWEEN 20 AND 40;

-- View all vehicles owned by a given driver
SELECT v.* FROM vehicle v
JOIN driver d ON v.driver_id = d.driver_id
WHERE d.full_name = ?; -- place holder for now

-- View all vehicles with expired registrations as of given date
SELECT v.*, vr.expiration_date
FROM vehicle v
JOIN vehicleRegistration vr ON v.vehicle_id = vr.vehicle_id
WHERE vr.expiration_date <= CURDATE() OR vr.registration_status = 'expired';

-- View all drivers with expired or suspended licenses
SELECT d.*, l.license_status
FROM driver d
JOIN license l ON d.driver_id = l.driver_id
WHERE l.license_status IN ('Expired', 'Suspended')
ORDER BY l.license_status, d.full_name;

-- View all traffic violations by a given driver within a date range
SELECT d.full_name, tv.violation_type, tv.violation_date_time, tv.fine_amount
FROM traffic_violation tv
JOIN driver d ON tv.driver_id = d.driver_id
WHERE d.driver_id = 1 
  AND tv.violation_date_time BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY tv.violation_date_time DESC;

-- View the total number of violations per violation type for a given year
SELECT violation_type, COUNT(*) AS total_violations 
FROM traffic_violation 
WHERE YEAR(violation_date_time) = 2025 
GROUP BY violation_type;

-- View all vehicles involved in violations within a given city or region
SELECT DISTINCT v.* FROM vehicle v
JOIN traffic_violation tv ON v.vehicle_id = tv.vehicle_id 
WHERE tv.location LIKE '%Manila%';
