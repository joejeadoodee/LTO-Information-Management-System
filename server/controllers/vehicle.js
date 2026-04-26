import pool from "../db/database.js";

const getAllVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehicle");
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM vehicle WHERE vehicle_id = ?",
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No vehicle with id ${id}` });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const createVehicle = async (req, res) => {
  const {
    plate_no,
    engine_no,
    chassis_no,
    vehicle_type,
    make,
    model,
    manufacture_yr,
    color,
    driver_id,
  } = req.body;
  if (!plate_no || !engine_no || !chassis_no)
    return res.status(400).json({
      success: false,
      msg: "Please provide plate_no, engine_no, and chassis_no",
    });
  try {
    const [result] = await pool.query(
      "INSERT INTO vehicle (plate_no, engine_no, chassis_no, vehicle_type, make, model, manufacture_yr, color, driver_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        plate_no,
        engine_no,
        chassis_no,
        vehicle_type,
        make,
        model,
        manufacture_yr,
        color,
        driver_id,
      ],
    );
    res.status(201).json({
      success: true,
      msg: "Vehicle created",
      vehicle_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const {
    plate_no,
    engine_no,
    chassis_no,
    vehicle_type,
    make,
    model,
    manufacture_yr,
    color,
    driver_id,
  } = req.body;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM vehicle WHERE vehicle_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No vehicle with id ${id}` });
    await pool.query(
      "UPDATE vehicle SET plate_no = ?, engine_no = ?, chassis_no = ?, vehicle_type = ?, make = ?, model = ?, manufacture_yr = ?, color = ?, driver_id = ? WHERE vehicle_id = ?",
      [
        plate_no,
        engine_no,
        chassis_no,
        vehicle_type,
        make,
        model,
        manufacture_yr,
        color,
        driver_id,
        id,
      ],
    );
    res.status(200).json({ success: true, msg: "Vehicle updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM vehicle WHERE vehicle_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No vehicle with id ${id}` });
    await pool.query("DELETE FROM vehicle WHERE vehicle_id = ?", [id]);
    res.status(200).json({ success: true, msg: `Vehicle ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View all vehicles owned by a given driver
const getVehiclesByDriver = async (req, res) => {
  const { id } = req.query;

  if (!id)
    return res.status(400).json({
      success: false,
      msg: "Please provide id as a query param",
    });

  try {
    const [rows] = await pool.query(
      `
      SELECT v.*
      FROM vehicle v
      JOIN driver d ON v.driver_id = d.driver_id
      WHERE d.driver_id = ?
    `,
      [id],
    );

    if (rows.length === 0)
      return res.status(404).json({
        success: false,
        msg: `No vehicles found for driver: ${id}`,
      });

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getVehiclesExpiredRegistration = async (req, res) => {
  const { date } = req.query;

  if (!date)
    return res.status(400).json({
      success: false,
      msg: "Please provide date as a query param",
    });

  try {
    const [rows] = await pool.query(
      `SELECT v.*, vr.*
       FROM vehicle v
       JOIN vehicleRegistration vr ON v.vehicle_id = vr.vehicle_id
       WHERE vr.expiration_date <= ?
       `,
      [date],
    );
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// View all vehicles involved in violations within a given city or region
const getVehiclesByViolationLocation = async (req, res) => {
  const { location } = req.query;

  if (!location)
    return res.status(400).json({
      success: false,
      msg: "Please provide location as a query param",
    });

  try {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT v.*, tv.*
      FROM vehicle v
      JOIN traffic_violation tv ON v.vehicle_id = tv.vehicle_id
      WHERE tv.location LIKE ?
    `,
      [`%${location}%`],
    );

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDriver,
  getVehiclesExpiredRegistration,
  getVehiclesByViolationLocation,
};
