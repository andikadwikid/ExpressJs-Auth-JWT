const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const model = require("../models");
const User = model.User;
const Role = model.Role;

require("dotenv").config();

exports.signup = async (req, res) => {
  const { username, email, password, roleId } = req.body;
  try {
    // generate password
    const salt = await bcrypt.genSalt(10);
    // hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // cek apakah roleId ada atau tidak
    if (roleId) {
      // jika roleId ada maka cari role berdasarkan roleId
      const role = await Role.findByPk(roleId);

      //jika tidak ada role maka kirim response ke client
      !role && res.status(400).send("Role does not exist!");

      // jika ada role maka set role ke user yang baru dibuat dan kirim response ke client
      await user.setRole(role);
      res.send({ message: "User was registered successfully!" });
    } else {
      // jika roleId tidak ada maka set role default ke user yang baru dibuat dan kirim response ke client
      const role = await Role.findOne({
        where: {
          name: "guest",
        },
      });
      await user.setRole(role);
      res.send({ message: "User was registered successfully!" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  console.log(user.password);
  !user && res.status(404).send("User Not found.");

  const passwordIsValid = bcrypt.compare(password, user.password);

  !passwordIsValid &&
    res.status(401).send({ accessToken: null, message: "Invalid Password!" });

  const token = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24, // 24 hours
  });

  res.status(200).send({
    id: user.id,
    username: user.username,
    email: user.email,
    accessToken: token,
  });
};
