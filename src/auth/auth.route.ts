import { Request, Response, Router } from "express";
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");

dotenv.config();
const router = Router();

router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({ username, email, password: hashedPassword });

    // Save user to database
    await user.save();

    // Create and return JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.log(err);
          res.status(500).send("Server error");
        }
        res.json({ token });
      }
    );
  })
);

module.exports = router;
