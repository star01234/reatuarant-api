const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controllers");
const {authJwt} = require ("../middlewares");

//Create a restaurant
//POST http://localhost:5000/api/v1/restaurants/
router.post("/",[authJwt.verifyToken,authJwt.isModOrAdmin], restaurantController.create);

//Get All restaurant
router.get("/", restaurantController.getAll);

//get a restaurant by ID
router.get("/:id",[authJwt.verifyToken],restaurantController.getById);

//update a restaurant
router.put("/:id",[authJwt.verifyToken,authJwt.isModOrAdmin],restaurantController.update);

//delete a restaurant
router.delete(
  "/:id",[authJwt.verifyToken, authJwt.isAdmin],restaurantController.delete
);

module.exports = router