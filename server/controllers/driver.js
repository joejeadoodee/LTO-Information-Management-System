import pool from "../db/database.js";

const getAllDrivers = async (req, res) => {
  try {
    // Get drivers and their licenes
    // Order based on license_issuance_date from latest to oldest
    const [rows] = await pool.query(`
      SELECT d.*, l.* 
      FROM driver d 
      LEFT JOIN license l 
      ON d.driver_id = l.driver_id 
      ORDER BY d.driver_id, l.license_issuance_date DESC;
      `);

    // Map drivers to a hashmap
    const driverMap = {};
    rows.forEach((row) => {
      // Separate driver fields and license fields
      const {
        driver_id,
        license_number,
        full_name,
        date_of_birth,
        sex,
        address,
        ...licenseFields
      } = row;

      if (!driverMap.hasOwnProperty(row.driver_id)) {
        driverMap[row.driver_id] = {
          driver_id,
          license_number,
          full_name,
          date_of_birth,
          sex,
          address,
          license_issuances: [],
        };
      }

      // Only add license if it exists
      if (licenseFields.issue_id) {
        driverMap[row.driver_id].license_issuances.push({ ...licenseFields });
      }
    });

    // Return values as array of objects
    res.status(200).json({ success: true, data: Object.values(driverMap) });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getDriver = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM driver WHERE driver_id = ?",
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No driver with id ${id}` });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const createDriver = async (req, res) => {
  const { license_number, full_name, date_of_birth, sex, address } = req.body;
  if (!license_number || !full_name || !date_of_birth || !sex)
    return res.status(400).json({
      success: false,
      msg: "Please provide license_number, full_name, date_of_birth, and sex",
    });
  try {
    const [result] = await pool.query(
      "INSERT INTO driver (license_number, full_name, date_of_birth, sex, address) VALUES (?, ?, ?, ?, ?)",
      [license_number, full_name, date_of_birth, sex, address],
    );
    res.status(201).json({
      success: true,
      msg: "Driver created",
      driver_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateDriver = async (req, res) => {
  const { id } = req.params;
  const { license_number, full_name, date_of_birth, sex, address } = req.body;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM driver WHERE driver_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No driver with id ${id}` });
    const [result] = await pool.query(
      "UPDATE driver SET license_number = ?, full_name = ?, date_of_birth = ?, sex = ?, address = ? WHERE driver_id = ?",
      [license_number, full_name, date_of_birth, sex, address, id],
    );
    res.status(200).json({ success: true, msg: "Driver updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteDriver = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM driver WHERE driver_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No driver with id ${id}` });
    await pool.query("DELETE FROM driver WHERE driver_id = ?", [id]);
    res.status(200).json({ success: true, msg: `Driver ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View all registered drivers filtered by license type, status, age range, sex
const getFilteredDrivers = async (req, res) => {
  const { license_type, license_status, sex, age_min, age_max } = req.query;

  // Join drivers with corresponding licenses
  // Get latest license issuance of driver
  // Join drivers with latest license issuance
  let filterQuery = `
    SELECT d.*,
           l.license_type, l.license_status, l.license_issuance_date
    FROM driver d
    LEFT JOIN license l ON d.driver_id = l.driver_id
    LEFT JOIN (
      SELECT driver_id, MAX(license_issuance_date) AS latest_date
      FROM license
      GROUP BY driver_id
    ) latest ON l.driver_id = latest.driver_id
            AND l.license_issuance_date = latest.latest_date
    WHERE (l.license_issuance_date = latest.latest_date OR l.driver_id IS NULL)
  `;

  // Apply filters
  const params = [];

  if (license_type) {
    filterQuery += " AND l.license_type = ?";
    params.push(license_type);
  }
  if (license_status) {
    filterQuery += " AND l.license_status = ?";
    params.push(license_status);
  }
  if (sex) {
    filterQuery += " AND d.sex = ?";
    params.push(sex);
  }
  if (age_min) {
    filterQuery += " AND TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) >= ?";
    params.push(age_min);
  }
  if (age_max) {
    filterQuery += " AND TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) <= ?";
    params.push(age_max);
  }

  try {
    const [filteredRows] = await pool.query(filterQuery, params);

    if (filteredRows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Get all license issuances for the filtered drivers
    const driverIds = filteredRows.map((row) => row.driver_id);
    const [allLicenses] = await pool.query(
      `SELECT * FROM license 
       WHERE driver_id IN (?)
       ORDER BY driver_id, license_issuance_date DESC`,
      [driverIds],
    );

    // Map licenses to their drivers
    const licenseMap = {};
    allLicenses.forEach((license) => {
      if (!licenseMap[license.driver_id]) {
        licenseMap[license.driver_id] = [];
      }
      licenseMap[license.driver_id].push(license);
    });

    const data = filteredRows.map((row) => {
      const {
        driver_id,
        license_number,
        full_name,
        date_of_birth,
        sex,
        address,
      } = row;
      return {
        driver_id,
        license_number,
        full_name,
        date_of_birth,
        sex,
        address,
        license_issuances: licenseMap[driver_id] || [],
      };
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View all drivers with expired or suspended licenses
const getExpiredOrSuspendedDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, l.*
      FROM driver d
      JOIN license l ON d.driver_id = l.driver_id
      JOIN (
        SELECT driver_id, MAX(license_issuance_date) AS latest_date
        FROM license
        GROUP BY driver_id
      ) latest ON l.driver_id = latest.driver_id
              AND l.license_issuance_date = latest.latest_date
      WHERE l.license_status IN ('Expired', 'Suspended')
      ORDER BY l.license_status, d.full_name
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View all traffic violations by a given driver within a date range
const getDriverViolations = async (req, res) => {
  const { id } = req.params;
  const { date_from, date_to } = req.query;

  if (!date_from || !date_to)
    return res.status(400).json({
      success: false,
      msg: "Please provide date_from and date_to as query params",
    });

  try {
    const [existing] = await pool.query(
      "SELECT * FROM driver WHERE driver_id = ?",
      [id],
    );

    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No driver with id ${id}` });

    const [rows] = await pool.query(
      `
      SELECT d.*, tv.*
      FROM traffic_violation tv
      JOIN driver d ON tv.driver_id = d.driver_id
      WHERE d.driver_id = ?
        AND tv.violation_date_time BETWEEN ? AND ?
      ORDER BY tv.violation_date_time DESC
    `,

      [id, date_from, date_to],
    );

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getFilteredDrivers,
  getExpiredOrSuspendedDrivers,
  getDriverViolations,
};
