const router = require("express").Router();
const header = require("../middleware/header");
const authJwt = require("../middleware/authJwt");

const userController = require("../controllers/user.controller");

router.get("/all", userController.allAccess);
router.get(
  "/admin",
  [header, authJwt.verifyToken, authJwt.isAdmin],
  userController.adminBoard
);

module.exports = router;
