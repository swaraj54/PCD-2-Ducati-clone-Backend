import { Router } from "express";
import { login, loginAdmin, register, getCurrentUser } from "../contollers/auth.controllers.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login-admin", loginAdmin);
router.post("/get-current-user", getCurrentUser);

export default router;
