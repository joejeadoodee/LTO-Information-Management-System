import express from "express";
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDriver,
  getVehiclesExpiredRegistration,
  getVehiclesByViolationLocation,
} from "../controllers/vehicle.js";

const router = express.Router();

router.get("/", getAllVehicles);
router.post("/", createVehicle);
router.get("/by-driver", getVehiclesByDriver);
router.get("/expired-registration", getVehiclesExpiredRegistration);
router.get("/by-violation-location", getVehiclesByViolationLocation);
router.get("/:id", getVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
