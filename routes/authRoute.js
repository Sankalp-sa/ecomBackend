import express from "express";
import {
  registerController,
  loginController,
  testContorller,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

//router

// register || method: POST
router.post("/register", registerController);

// LOGIN || method: POST
router.post("/login", loginController);

router.get("/test", requireSignIn, isAdmin, testContorller);

// Protected route User auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Protected route admin

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Forgot password
router.post("/forgot-password", forgotPasswordController);

// update Profile
router.put("/update-profile", requireSignIn, updateProfileController);

// order
router.get("/order", requireSignIn, getOrderController);

export default router;
