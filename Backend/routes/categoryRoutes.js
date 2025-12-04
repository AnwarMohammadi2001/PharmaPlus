import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory); // Add category
router.get("/", getCategories); // Get all categories
router.put("/:id", updateCategory); // Update category
router.delete("/:id", deleteCategory); // Delete category

export default router;
