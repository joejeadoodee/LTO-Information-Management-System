import pool from "../db/database.js";

const getAllViolations = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM traffic_violation");
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getViolation = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM traffic_violation WHERE violation_id = ?",
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No violation with id ${id}` });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const createViolation = async (req, res) => {
  const {
    violation_type,
    violation_date_time,
    location,
    fine_amount,
    violation_status,
    officer_name,
    driver_id,
    vehicle_id,
  } = req.body;
  if (
    !violation_type ||
    !violation_date_time ||
    !location ||
    !fine_amount ||
    !driver_id
  )
    return res.status(400).json({
      success: false,
      msg: "Please provide violation_type, violation_date_time, location, fine_amount, and driver_id",
    });
  try {
    const [result] = await pool.query(
      "INSERT INTO traffic_violation (violation_type, violation_date_time, location, fine_amount, violation_status, officer_name, driver_id, vehicle_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        violation_type,
        violation_date_time,
        location,
        fine_amount,
        violation_status || "unpaid",
        officer_name,
        driver_id,
        vehicle_id,
      ],
    );
    res.status(201).json({
      success: true,
      msg: "Violation created",
      violation_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateViolation = async (req, res) => {
  const { id } = req.params;
  const {
    violation_type,
    violation_date_time,
    location,
    fine_amount,
    violation_status,
    officer_name,
    driver_id,
    vehicle_id,
  } = req.body;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM traffic_violation WHERE violation_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No violation with id ${id}` });
    await pool.query(
      "UPDATE traffic_violation SET violation_type = ?, violation_date_time = ?, location = ?, fine_amount = ?, violation_status = ?, officer_name = ?, driver_id = ?, vehicle_id = ? WHERE violation_id = ?",
      [
        violation_type,
        violation_date_time,
        location,
        fine_amount,
        violation_status,
        officer_name,
        driver_id,
        vehicle_id,
        id,
      ],
    );
    res.status(200).json({ success: true, msg: "Violation updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteViolation = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM traffic_violation WHERE violation_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No violation with id ${id}` });
    await pool.query("DELETE FROM traffic_violation WHERE violation_id = ?", [
      id,
    ]);
    res.status(200).json({ success: true, msg: `Violation ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View total number of violations per type for a given year
const getViolationsByYear = async (req, res) => {
  const { year } = req.query;

  if (!year)
    return res
      .status(400)
      .json({ success: false, msg: "Please provide year as a query param" });

  try {
    const [rows] = await pool.query(
      `
      SELECT violation_type, COUNT(*) AS total_violations
      FROM traffic_violation
      WHERE YEAR(violation_date_time) = ?
      GROUP BY violation_type
    `,
      [year],
    );

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export {
  getAllViolations,
  getViolation,
  createViolation,
  updateViolation,
  deleteViolation,
  getViolationsByYear,
};
