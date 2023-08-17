import express from "express";
import { SingleCategoryController, categoryController, createCategoryController, deleteCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes

// Create category || method: POST
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// Update category || method: PUT
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController);

// Get all Categories || method: GET
router.get("/get-categories", categoryController);

// single category
router.get("/get-category/:slug", SingleCategoryController);

// Delete category || method: DELETE
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategoryController);

export default router;
