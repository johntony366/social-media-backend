import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ARequest, protectJWT } from "../middleware/auth.middleware";
import { User } from "../models/user.model";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  })
);

router.put(
  "/",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const id = req.user.id;

    await User.findByIdAndUpdate(id, {
      $set: req.body,
    });

    res.status(200).json({ msg: "User updated" });
  })
);

router.delete(
  "/",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const id = req.user.id;

    await User.findByIdAndDelete(id);

    res.status(200).json({ msg: "User deleted" });
  })
);

router.get(
  "/:id",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  })
);

export default router;
