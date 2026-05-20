import express from "express";
import {
  getAllRegistrations,
  getRegistration,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  getVehicleRegistrations,
} from "../controllers/vehicleRegistration.js";

const router = express.Router();

router.get("/", getAllRegistrations);
router.get("/vehicle", getVehicleRegistrations);
router.post("/", createRegistration);
router.get("/:id", getRegistration);
router.put("/:id", updateRegistration);
router.delete("/:id", deleteRegistration);

export default router;
