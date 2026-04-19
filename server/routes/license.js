import express from "express";
import {
  getAllLicenses,
  getLicense,
  createLicense,
  updateLicense,
  deleteLicense,
} from "../controllers/license.js";

const router = express.Router();

router.get("/", getAllLicenses);
router.post("/", createLicense);
router.get("/:id", getLicense);
router.put("/:id", updateLicense);
router.delete("/:id", deleteLicense);

export default router;
