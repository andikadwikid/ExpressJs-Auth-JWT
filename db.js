const { Sequelize } = require("sequelize");

module.exports = sequelize = async () => {
  const connection = new Sequelize("restapi", "root", "", {
    host: "localhost",
    dialect: "mysql",
  });

  try {
    connection.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
