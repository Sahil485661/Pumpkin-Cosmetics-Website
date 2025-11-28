import express from "express";
import { getDashboardStats } from "../controller/dashboardController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

// Admin dashboard statistics
router.route("/admin/dashboard/stats").get(verifyUserAuth, roleBasedAccess("admin"), getDashboardStats);

export default router;