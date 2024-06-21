import { Router } from "express";
import {
  allBikes,
  singleBike,
  addToCart,
  getCartProducts,
  buyBike,
  purchaseHistory,
} from "../contollers/user.controllers.js";

const router = Router();

router.get("/all-bikes", allBikes);
router.post("/single-bike", singleBike);
router.post("/add-to-cart", addToCart);
router.post("/get-cart-products", getCartProducts);
router.post("/buy-bike", buyBike);
router.post("/purchase-history", purchaseHistory);

export default router;
