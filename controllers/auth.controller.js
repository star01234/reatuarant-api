const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken"); //ต้องลง npm i jsonwebtoken
const bcrypt = require("bcryptjs"); //ต้องลง npm i bcryptjs
const {Op} = require("sequelize");

//Register a new user
exports.signup = async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400).send({
            message: "Please provide all required fields"
        });
        return;
    }

    //Prepaer user data
    const newUser = {
        username:username,
        email:email,
        password:bcrypt.hashSync(password, 9),
    };

    //Save user in the database
    await User.create(newUser).then((user) => {
        if(res.body.role){
            Role.findAll({
                where:{
                    name: {[Op.or]: req.body.role},
                }
            }).then((roles)=>{
                user.setRoles(roles).then(()=>{
                    res.send({
                        message: "User registered successfully!"
                    })
                })
            });
        }else{
            //set defautl rple to "user" id=1
            user.setRoles([1]).then(() => {
                res.send({
                  message: "User registered successfully!",
                });
            });
        }
    }).catch((error) => {
        res.status(500).send({
            message: error.message || "Something error occured while registering a new user."
        });
    });
};