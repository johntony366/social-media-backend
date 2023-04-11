import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { protectJWT } from "../middleware/auth.middleware";

const router = require("express").Router();

router.get(
  "/",
  protectJWT,
  expressAsyncHandler(async (req: Request, res: Response) => {
    res.send("Hello World!");
  })
);

router.get("/:id", async (req: Request, res: Response) => {});

module.exports = router;
