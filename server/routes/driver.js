import express from "express";
import {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  getFilteredDrivers,
  getExpiredOrSuspendedDrivers,
  getDriverViolations,
} from "../controllers/driver.js";

const router = express.Router();

router.get("/", getAllDrivers);
router.post("/", createDriver);
router.get("/filter", getFilteredDrivers);
router.get("/expired-suspended", getExpiredOrSuspendedDrivers);
router.get("/:id", getDriver);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);
router.get("/:id/violations", getDriverViolations);

export default router;
