import express from "express";
import {
  UpdateProductController,
  addDiscountController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getAllDiscountProductController,
  getAllProductsController,
  getProductPhotoController,
  getSingleProductsController,
  paymentController,
  productCountController,
  productFilterController,
  productPageController,
  searchProductController,
  similarProductController,
} from "../controllers/productController.js";
import ExpressFormidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import braintree from "braintree";

const router = express.Router();

//routes

// Create product || method: POST
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  createProductController
);

// Update product || method: PUT
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  ExpressFormidable(),
  UpdateProductController
);

// get all products || method: GET
router.get("/get-all-products", getAllProductsController);

// get single product || method: GET
router.get("/get-single-product/:slug", getSingleProductsController);

// get photo || method: GET
router.get("/get-product-photo/:pid", getProductPhotoController);

// delete product || method: DELETE
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// product count || method: GET
router.get("/product-count", productCountController);

// product per page || method: GET
router.post("/product-list/:page", productPageController);

// Search product || method: get
router.get("/search-product/:keyword", searchProductController);

// fitler product || method: get
router.post("/filter-product", productFilterController);

// Similar product || method: get
router.get("/similar-product/:pid/:cid", similarProductController);

// payment gateway route
// token
router.get("/braintree/token", requireSignIn, braintreeTokenController);

// payment
router.post("/braintree/payment", requireSignIn, paymentController);

// add discount route
router.post("/add-discount/:pid", requireSignIn, isAdmin, addDiscountController);

// get discount products
router.get("/discount-products", getAllDiscountProductController);

export default router;