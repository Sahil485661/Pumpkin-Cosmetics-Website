import express from "express";
import { allMyOrders, createNewOrder, deleteOrder, getAllOrders, getSingleOrder, updateOrderStatus } from "../controller/orderController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();
router.route("/new/order").post(verifyUserAuth, createNewOrder);
router.route("/admin/order/:id")
.get(verifyUserAuth, roleBasedAccess("admin"), getSingleOrder)
.put(verifyUserAuth, roleBasedAccess("admin"), updateOrderStatus)
.delete(verifyUserAuth, roleBasedAccess("admin"), deleteOrder)
router.route("/admin/orders").get(verifyUserAuth, roleBasedAccess("admin"), getAllOrders);
// Allow authenticated users to view their own order details
router.route("/order/:id").get(verifyUserAuth, getSingleOrder);
router.route("/orders/user").get(verifyUserAuth, allMyOrders);
export default router;