const router = require("express").Router();
const header = require("../middleware/header");
const verifySignUp = require("../middleware/verifySignUp");

const userController = require("../controllers/auth.controller");

router.post(
  "/signup",
  [
    header,
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted,
  ],
  userController.signup
);

router.post("/signin", userController.signin);

module.exports = router;
