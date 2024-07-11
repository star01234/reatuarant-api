const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const restaurantRouter = require("./routers/restaurant.router");

//use maideware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//use router
app.use("/api/v1/restaurants", restaurantRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello Restaurant API</h1>");
});

app.listen(5000, () => {
  console.log("listening to http://localhost:" + PORT);
});
