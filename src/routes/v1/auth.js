const express = require("express");
const authController = require("../../app/controllers/auth");
const { AuthController } = require("../../app/users");

const router = express.Router();


router.get("/", authController.FirstRoute);

router.post("/signin", AuthController.signin);
router.post("/verify/phone-number", AuthController.verifyPhoneNumber);
router.post("/verify/otp", AuthController.verifyOTP);
router.get("/google", AuthController.googleAuth);
router.get("/callback", AuthController.googleRedirect);

module.exports = {
  baseUrl: "/auth",
  router,
};
  