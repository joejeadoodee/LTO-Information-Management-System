import express from "express";
import {
  getAllRegistrations,
  getRegistration,
  createRegistration,
  updateRegistration,
  deleteRegistration,
} from "../controllers/vehicleRegistration.js";

const router = express.Router();

router.get("/", getAllRegistrations);
router.post("/", createRegistration);
router.get("/:id", getRegistration);
router.put("/:id", updateRegistration);
router.delete("/:id", deleteRegistration);

export default router;
