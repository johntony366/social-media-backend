const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(
  cors({
    allowedHeaders: "*, auth",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () => {
  console.log("Backend server is up and running!");
});
