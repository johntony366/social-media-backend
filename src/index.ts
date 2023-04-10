const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
import { initDB } from "./db/initDB";

const app = express();
dotenv.config();

app.use(
  cors({
    allowedHeaders: "*, auth",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server is running on port ${process.env.PORT}`);
});
