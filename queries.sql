-- REPORTS TO BE GENERATED
-- View all registered drivers filtered by: License type, License status, Age range, Sex
SELECT
    d.*,
    l.license_type,
    l.license_status
FROM
    driver d
    JOIN license l ON d.driver_id = l.driver_id
WHERE
    l.license_type = 'Professional'
    AND l.license_status = 'Valid'
    AND d.sex = 'M'
    AND TIMESTAMPDIFF (YEAR, d.date_of_birth, CURDATE ()) BETWEEN 20 AND 40;

-- View all vehicles owned by a given driver
SELECT
    v.*
FROM
    vehicle v
    JOIN driver d ON v.driver_id = d.driver_id
WHERE
    d.full_name = ?;

-- place holder for now
-- View all vehicles with expired registrations as of given date
SELECT
    v.*,
    vr.expiration_date
FROM
    vehicle v
    JOIN vehicleRegistration vr ON v.vehicle_id = vr.vehicle_id
WHERE
    vr.expiration_date <= CURDATE ();

-- View all drivers with expired or suspended licenses
SELECT
    d.*,
    l.license_status
FROM
    driver d
    JOIN license l ON d.driver_id = l.driver_id
WHERE
    l.license_status IN ('Expired', 'Suspended')
ORDER BY
    l.license_status,
    d.full_name;

-- View all traffic violations by a given driver within a date range
SELECT
    d.full_name,
    tv.violation_type,
    tv.violation_date_time,
    tv.fine_amount
FROM
    traffic_violation tv
    JOIN driver d ON tv.driver_id = d.driver_id
WHERE
    d.driver_id = 1
    AND tv.violation_date_time BETWEEN '2025-01-01' AND '2025-12-31'
ORDER BY
    tv.violation_date_time DESC;

-- View the total number of violations per violation type for a given year
SELECT
    violation_type,
    COUNT(*) AS total_violations
FROM
    traffic_violation
WHERE
    YEAR (violation_date_time) = 2025
GROUP BY
    violation_type;

-- View all vehicles involved in violations within a given city or region
SELECT DISTINCT
    v.*
FROM
    vehicle v
    JOIN traffic_violation tv ON v.vehicle_id = tv.vehicle_id
WHERE
    tv.location LIKE '%Manila%';
