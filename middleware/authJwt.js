const jwt = require("jsonwebtoken");
const User = require("../models").User;
require("dotenv").config();

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  !token && res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    err && res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (user.roleId == 1) {
    return next();
  }

  return res.status(403).send({
    message: "Require Admin Role!",
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
};

module.exports = authJwt;
