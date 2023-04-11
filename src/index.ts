const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorHandler.middleware");
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

app.use("/api/auth", require("./auth/auth.route"));
app.use("/api/user", require("./user/user.route"));

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend server is running on port ${process.env.PORT}`);
});
