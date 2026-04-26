import express from "express";
import {
  getAllViolations,
  getViolation,
  createViolation,
  updateViolation,
  deleteViolation,
  getViolationsByYear,
} from "../controllers/trafficViolation.js";

const router = express.Router();

router.get("/", getAllViolations);
router.post("/", createViolation);
router.get("/by-year", getViolationsByYear);
router.get("/:id", getViolation);
router.put("/:id", updateViolation);
router.delete("/:id", deleteViolation);

export default router;
