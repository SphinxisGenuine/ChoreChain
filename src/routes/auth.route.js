import { Router } from "express";
import { changepassword, forgotPasswordRequest, login, logout, refreshAccessToken, registeruser, resendEmailVerification, resetPassword, verifytoken } from "../controller/auth.controller.js";
import { verifyJWT } from "../middlleware/auth.middleware.js";
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userLoginValidator, userRegisterValidator, userResetForgotPasswordValidator } from "../validators/index.js";
import { validate } from "../middlleware/validator.middleware.js";
const router =Router()
//unsec
router.route("/register").post(userRegisterValidator(),validate,registeruser)
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/verify-email/:verificationtoken").get(verifytoken)
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetPassword)
router.route("/refresh-token").post(refreshAccessToken)
//sec
router.route("/logout").post(verifyJWT,logout)
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changepassword)
router.route("/resend-verification").post(verifyJWT,resendEmailVerification)


export default router;