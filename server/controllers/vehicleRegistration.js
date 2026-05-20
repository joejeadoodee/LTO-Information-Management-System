import pool from "../db/database.js";

const getAllRegistrations = async (req, res) => {
  try {
    const queryStr = `
      SELECT 
        v.vehicle_id,
        v.plate_no,
        v.make,
        v.model,
        v.vehicle_type,
        v.color,
        vr.vehicle_reg_id,
        vr.registration_no,
        vr.registration_date,
        vr.expiration_date,
        vr.registration_status
      FROM 
        vehicle v
      INNER JOIN 
        vehicleRegistration vr ON v.vehicle_id = vr.vehicle_id
    `;
    
    const [rows] = await pool.query(queryStr);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getVehicleRegistrations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM vehicle v JOIN vehicleRegistration vr ON v.vehicle_id=vr.vehicle_id",
    );
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getRegistration = async (req, res) => {
  const { id } = req.params;
  try {
    const queryStr = `
      SELECT 
        v.vehicle_id,
        v.plate_no,
        v.make,
        v.model,
        v.vehicle_type,
        v.color,
        vr.vehicle_reg_id,
        vr.registration_no,
        vr.registration_date,
        vr.expiration_date,
        vr.registration_status
      FROM 
        vehicle v
      INNER JOIN 
        vehicleRegistration vr ON v.vehicle_id = vr.vehicle_id
      WHERE 
        vr.vehicle_reg_id = ?
    `;
    
    const [rows] = await pool.query(queryStr, [id]);
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No registration with id ${id}` });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const createRegistration = async (req, res) => {
  const {
    registration_no,
    registration_date,
    expiration_date,
    registration_status,
    vehicle_id,
  } = req.body;
  if (
    !registration_no ||
    !registration_date ||
    !expiration_date ||
    !registration_status ||
    !vehicle_id
  )
    return res
      .status(400)
      .json({ success: false, msg: "Please provide all required fields" });
  try {
    const [result] = await pool.query(
      "INSERT INTO vehicleRegistration (registration_no, registration_date, expiration_date, registration_status, vehicle_id) VALUES (?, ?, ?, ?, ?)",
      [
        registration_no,
        registration_date,
        expiration_date,
        registration_status,
        vehicle_id,
      ],
    );
    res.status(201).json({
      success: true,
      msg: "Registration created",
      vehicle_reg_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateRegistration = async (req, res) => {
  const { id } = req.params;
  const {
    registration_no,
    registration_date,
    expiration_date,
    registration_status,
    vehicle_id,
    color,
  } = req.body;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM vehicleRegistration WHERE vehicle_reg_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No registration with id ${id}` });

    if (color && vehicle_id) {
      await pool.query(
        "UPDATE vehicle SET color = ? WHERE vehicle_id = ?",
        [color, vehicle_id]
      );
    }

    await pool.query(
      "UPDATE vehicleRegistration SET registration_no = ?, registration_date = ?, expiration_date = ?, registration_status = ?, vehicle_id = ? WHERE vehicle_reg_id = ?",
      [
        registration_no,
        registration_date,
        expiration_date,
        registration_status,
        vehicle_id,
        id,
      ],
    );
    res.status(200).json({ success: true, msg: "Registration updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteRegistration = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM vehicleRegistration WHERE vehicle_reg_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No registration with id ${id}` });
    await pool.query(
      "DELETE FROM vehicleRegistration WHERE vehicle_reg_id = ?",
      [id],
    );
    res.status(200).json({ success: true, msg: `Registration ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export {
  getAllRegistrations,
  getVehicleRegistrations,
  getRegistration,
  createRegistration,
  updateRegistration,
  deleteRegistration,
};