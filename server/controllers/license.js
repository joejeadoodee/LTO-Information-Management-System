import pool from "../db/database.js";

const getAllLicenses = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM license");
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const getLicense = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM license WHERE issue_id = ?",
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No license with id ${id}` });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const createLicense = async (req, res) => {
  const {
    license_issuance_date,
    license_expiration_date,
    license_status,
    license_type,
    driver_id,
  } = req.body;
  if (
    !license_issuance_date ||
    !license_expiration_date ||
    !license_type ||
    !driver_id
  )
    return res
      .status(400)
      .json({ success: false, msg: "Please provide all required fields" });
  try {
    const [result] = await pool.query(
      "INSERT INTO license (license_issuance_date, license_expiration_date, license_status, license_type, driver_id) VALUES (?, ?, ?, ?, ?)",
      [
        license_issuance_date,
        license_expiration_date,
        license_status || "Valid",
        license_type,
        driver_id,
      ],
    );
    res.status(201).json({
      success: true,
      msg: "License created",
      issue_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const updateLicense = async (req, res) => {
  const { id } = req.params;
  const {
    license_issuance_date,
    license_expiration_date,
    license_status,
    license_type,
    driver_id,
  } = req.body;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM license WHERE issue_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No license with id ${id}` });
    await pool.query(
      "UPDATE license SET license_issuance_date = ?, license_expiration_date = ?, license_status = ?, license_type = ?, driver_id = ? WHERE issue_id = ?",
      [
        license_issuance_date,
        license_expiration_date,
        license_status,
        license_type,
        driver_id,
        id,
      ],
    );
    res.status(200).json({ success: true, msg: "License updated" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

const deleteLicense = async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query(
      "SELECT * FROM license WHERE issue_id = ?",
      [id],
    );
    if (existing.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: `No license with id ${id}` });
    await pool.query("DELETE FROM license WHERE issue_id = ?", [id]);
    res.status(200).json({ success: true, msg: `License ${id} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

export {
  getAllLicenses,
  getLicense,
  createLicense,
  updateLicense,
  deleteLicense,
};
