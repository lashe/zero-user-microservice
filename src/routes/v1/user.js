const { UserController } = require("../../app/users");
const { auth, unAuth } = require("../../middlewares/userAuth/authMiddleware");


const router = require("express").Router();
// Paths
router.post("/signup", UserController.signUp);
router.get("/profile", auth, UserController.getUserbyId);
router.patch("/profile", auth, UserController.updateUserProfile);
router.get("/activities", auth, UserController.getUserActivities);
router.get("/logout", auth, unAuth, UserController.getUserbyId);
// 404 response
router.get("**", function (req, res) {
    res.status(404).json({ error: "Resource not found" });
  });

  module.exports = {
    baseUrl: "/user",
    router
  };