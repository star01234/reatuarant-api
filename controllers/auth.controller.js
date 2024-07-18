const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken"); //ต้องลง npm i jsonwebtoken
const bcrypt = require("bcryptjs"); //ต้องลง npm i bcryptjs
const { Op } = require("sequelize");
const { route } = require("../routers/restaurant.router");

//Register a new user
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }

  // Prepare user data
  const newUser = {
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 10), // Use appropriate salt rounds
  };

  try {
    // Save user in the database
    const user = await User.create(newUser);

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: { [Op.or]: req.body.roles },
        },
      });
      await user.setRoles(roles);
      res.send({
        message: "User registered successfully!",
      });
    } else {
      // Set default role to "user" id=1
      await user.setRoles([1]);
      res.send({
        message: "User registered successfully!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "An error occurred while registering a new user",
    });
  }
};

//Signin
exports.signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }
  //Select *From User where username = "username";
  await User.findOne({
    where: { username: username },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 h
      });

      roles.id;
      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLES_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occurred wile registering a new user",
      });
    });
};
