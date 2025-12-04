import express from "express";
import {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} from "../controllers/medicineController.js";

const router = express.Router();

router.post("/", createMedicine);
router.get("/", getMedicines);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;
