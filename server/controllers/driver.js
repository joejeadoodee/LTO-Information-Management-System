import pool from "../db/database.js";

const getAllDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM driver");
    res.status(200).json({ success: true, data: rows });
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

  let query = `
    SELECT d.*, l.license_type, l.license_status
    FROM driver d
    JOIN license l ON d.driver_id = l.driver_id
    WHERE 1=1
  `;
  const params = [];

  if (license_type) {
    query += " AND l.license_type = ?";
    params.push(license_type);
  }
  if (license_status) {
    query += " AND l.license_status = ?";
    params.push(license_status);
  }
  if (sex) {
    query += " AND d.sex = ?";
    params.push(sex);
  }
  if (age_min && age_max) {
    query +=
      " AND TIMESTAMPDIFF(YEAR, d.date_of_birth, CURDATE()) BETWEEN ? AND ?";
    params.push(age_min, age_max);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View all drivers with expired or suspended licenses
const getExpiredOrSuspendedDrivers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.*, l.license_status
      FROM driver d
      JOIN license l ON d.driver_id = l.driver_id
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
      SELECT d.full_name, tv.violation_type, tv.violation_date_time, tv.fine_amount
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
