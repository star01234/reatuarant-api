const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const restaurantRouter = require("./routers/restaurant.router");
const authRouter = require("./routers/auth.router");
const db = require("./models/");
const role = db.Role;
const cors = require("cors");

const corsOption = {
  origin: "http://localhost:5173/",
};

//Dev mode
/*db.sequelize.sync({force:true}).then(() =>{
  initRole();
  console.log("Drop and Sync DB");
})*/

const initRole = () => {
  role.create({ id: 1, name: "user" });
  role.create({ id: 2, name: "moderator" });
  role.create({ id: 3, name: "admin" });
};

//use maideware
//app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use router
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send("<h1>Hello Restaurant API</h1>");
});

app.listen(5000, () => {
  console.log("listening to http://localhost:" + PORT);
});
