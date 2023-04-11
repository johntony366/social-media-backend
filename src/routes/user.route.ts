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
    const user = await User.findById(req.user);
    res.status(200).json(user);
  })
);

router.get(
  "/:id",
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);
    console.log(user);
    res.status(200).json(user);
  })
);

export default router;
