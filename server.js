const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

const app = express();
require("dotenv").config();

const models = require("./models");
const User = models.User;
const Role = models.Role;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

app.post("/api/auth/role", async (req, res) => {
  const { name } = req.body;
  try {
    const role = await new Role({
      name: name,
    });
    const newRole = await role.save();
    res.status(200).json(newRole);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/testMethod", async (req, res) => {
  const user = await User.findOne({
    where: {
      id: 14,
    },
  });

  const getRole = await user.getRoleName();

  res.send(getRole);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

sequelize();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
