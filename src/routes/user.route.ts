import bcrypt from "bcryptjs";
import { Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { ARequest, protectJWT } from "../middleware/auth.middleware";
import { User } from "../models/user.model";
import { Router } from "express";
import { Document, Types } from "mongoose";

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
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const user: Document | null = await User.findById(req.params.id);

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...other } = user.toObject();
    console.log(other);

    res.status(200).json(other);
  })
);

router.put(
  "/:id/follow",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const currentUserID = req.user.id;
    const targetUserID = req.params.id;

    if (currentUserID == targetUserID) {
      throw new Error("You can't follow yourself");
    }

    const currentUser = await User.findById(currentUserID);

    if (currentUser.following.includes(new Types.ObjectId(targetUserID))) {
      throw new Error("You already follow this user");
    }

    const targetUser = await User.findById(targetUserID);

    currentUser.following.push(new Types.ObjectId(targetUserID));
    targetUser.followers.push(new Types.ObjectId(currentUserID));

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ msg: "User followed" });
  })
);

router.put(
  "/:id/unfollow",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const currentUserID = new Types.ObjectId(req.user.id);
    const targetUserID = new Types.ObjectId(req.params.id);

    if (currentUserID == targetUserID) {
      throw new Error("You can't unfollow yourself");
    }

    const currentUser = await User.findById(currentUserID);

    if (!currentUser.following.includes(targetUserID)) {
      throw new Error("You aren't following this user");
    }

    const targetUser = await User.findById(targetUserID);

    currentUser.following = currentUser.following.filter(
      (user) => !user.equals(targetUserID)
    );
    targetUser.followers = targetUser.followers.filter(
      (user) => !user.equals(currentUserID)
    );

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({ msg: "User unfollowed" });
  })
);

export default router;
