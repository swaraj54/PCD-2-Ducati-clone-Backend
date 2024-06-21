import { Router } from "express";
import AuthRoutes from "./auth.routes.js";
import AdminRoutes from "./admin.routes.js";
import UserRoutes from "./user.routes.js";
import { isUserAdmin } from "../middlewares/admin.middlewares.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", isUserAdmin, AdminRoutes);
router.use("/user", UserRoutes);

export default router;
