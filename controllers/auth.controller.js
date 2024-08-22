const config = require("../config/auth.config");
const db = require("../models/");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Register a new user
exports.signup = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ message: "Please provide all required fields!" });
    }

    // Prepare user data
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = { username, email, password: hashedPassword };

    // Save user in the database
    const user = await User.create(newUser);

    if (roles) {
      const rolesData = await Role.findAll({
        where: { name: { [Op.or]: roles } }
      });
      await user.setRoles(rolesData);
    } else {
      // Set default role to "user" (id = 1)
      await user.setRoles([1]);
    }

    res.send({ message: "User registered successfully!" });

  } catch (error) {
    res.status(500).send({ message: error.message || "Something went wrong while registering the user." });
  }
};

// Sign in
exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ message: "Please provide all required fields!" });
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Validate password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 }); // 24 hours

    // Get user roles
    const roles = await user.getRoles();
    const authorities = roles.map(role => "ROLES_" + role.name.toUpperCase());

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });

  } catch (error) {
    res.status(500).send({ message: error.message || "Something went wrong while signing in." });
  }
};
