import { Router } from "express";
import {
  addBike,
  editBike,
  deleteBike,
  getOrders,
} from "../contollers/admin.controllers.js";

const router = Router();

router.post("/add-bike", addBike);
router.post("/edit-bike", editBike);
router.post("/delete-bike", deleteBike);
router.post("/get-orders", getOrders);

export default router;
