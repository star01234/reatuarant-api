require("dotenv").config();

module.exports = {
  HOST: "ep-blue-sun-a1ykfegn-pooler.ap-southeast-1.aws.neon.tech",
  USER: "default",
  PASSWORD: "T9Q2DyJAgYtB",
  DB: "verceldb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
