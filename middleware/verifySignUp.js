const model = require("../models");
const User = model.User;
const Role = model.Role;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (user) {
    return res.status(400).send({
      message: "Failed! Username is already in use!",
    });
  }

  const email = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (email) {
    return res.status(400).send({
      message: "Failed! Email is already in use!",
    });
  }

  next();
};

const checkRolesExisted = async (req, res, next) => {
  const role = Role.findOne({
    where: {
      name: req.body.roleId,
    },
  });

  if (!role) {
    return res.status(400).send({
      message: "Failed! Role does not exist!",
    });
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
