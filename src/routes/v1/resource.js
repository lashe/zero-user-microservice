const { ResourceController } = require("../../app/resources");
const { auth, policy1, policy3, policy2, policy4 } = require("../../middlewares/userAuth/authMiddleware");


const router = require("express").Router();
// Paths

router.get("/resource", auth, policy4, ResourceController.getResource);
router.post("/resource", auth, policy2, ResourceController.createResource);
router.patch("/resource", auth, policy3, ResourceController.updateResource);
router.delete("/resource/:resourceId", auth, policy1, ResourceController.deleteResource);

// 404 response
router.get("**", function (req, res) {
    res.status(404).json({ error: "Resource not found" });
  });

  module.exports = {
    baseUrl: "/user",
    router
  };