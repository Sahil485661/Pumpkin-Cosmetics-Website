import express from "express";
import { deleteUser, getSingleUser, getUserDetails, getUserList, loginUser, logoutUser, registerUser, requestPasswordReset, resetPassword, updatePassword, updateProfile, updateUserRole, verifyEmail, resendVerificationEmail } from "../controller/userController.js";
import { roleBasedAccess, verifyUserAuth} from "../middleware/userAuth.js";
const router = express.Router();

// Routes
router.route("/register").post(registerUser);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-verification").post(resendVerificationEmail);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/password/forgot").post(requestPasswordReset);
router.route("/reset/:token").post(resetPassword);
router.route("/profile").post(verifyUserAuth, getUserDetails);
router.route("/password/update").post(verifyUserAuth, updatePassword);
router.route("/profile/update").put(verifyUserAuth, updateProfile);
router.route("/admin/users").get(verifyUserAuth, roleBasedAccess("admin"), getUserList);
router.route("/admin/user/:id").get(verifyUserAuth, roleBasedAccess("admin"), getSingleUser);
router.route("/admin/user/:id").put(verifyUserAuth, roleBasedAccess("admin"), updateUserRole);
router.route("/admin/user/:id").delete(verifyUserAuth, roleBasedAccess("admin"), deleteUser);
    
export default router;