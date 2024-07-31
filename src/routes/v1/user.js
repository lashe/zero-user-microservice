const { UserController } = require("../../app/users");
const auth = require("../../middlewares/userAuth/authMiddleware")

const router = require("express").Router();
// Paths
router.post("/signup", UserController.signUp);

// 404 response
router.get("**", function (req, res) {
    res.status(404).json({ error: "Resource not found" });
  });

  module.exports = {
    baseUrl: "/user",
    router
  };