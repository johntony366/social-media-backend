import { Response, Router } from "express";
import { ARequest, protectJWT } from "../middleware/auth.middleware";
import { Types } from "mongoose";
import { User } from "../models/user.model";
import expressAsyncHandler from "express-async-handler";
import { Post } from "../models/post.model";

const router = Router();

router.get(
  "/",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const userID = new Types.ObjectId(req.user.id);

    const user = await User.findById(userID);
    const posts = user.posts;

    res.status(200).json(posts);
  })
);

router.post(
  "/",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const { title, content } = req.body;
    const userID = new Types.ObjectId(req.user.id);
    const user = await User.findById(userID);

    const post = new Post({ author: user, title, content, likes: [] });
    await post.save();
    await User.updateOne({ _id: userID }, { $push: { posts: post } });

    res.status(200).json({ msg: "Post created" });
  })
);

router.delete(
  "/:id",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const { id } = req.params;
    const userID = req.user.id;

    await Post.deleteOne({ _id: id });
    await User.updateMany({ _id: userID }, { $pull: { posts: id } });

    res.status(200).json({ msg: "Post deleted" });
  })
);

router.put(
  "/:id",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const { id } = req.params;
    // const userID = req.user.id;

    await Post.updateOne({ _id: id }, { $set: req.body });
    // await User.updateMany(
    //   { _id: userID, posts: id },
    //   { $set: { "posts.$": id } }
    // );

    res.status(200).json({ msg: "Post updated" });
  })
);

router.put(
  "/:id/like",
  protectJWT,
  expressAsyncHandler(async (req: ARequest, res: Response) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post.likes.includes(req.user.id)) {
      await Post.updateOne({ _id: id }, { $pull: { likes: req.user.id } });
      res.status(200).json({ msg: "Post unliked" });
    } else {
      await Post.updateOne({ _id: id }, { $push: { likes: req.user.id } });
      res.status(200).json({ msg: "Post liked" });
    }
  })
);

router.get("/following", protectJWT, async (req: ARequest, res: Response) => {
  const { page = 1, pageSize = 10 } = req.body;
  const userID = req.user.id;

  const user = await User.findById(userID);
  const posts = await Post.find({ author: { $in: user.following } })
    .sort({
      createdAt: "desc",
    })
    .skip((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize));

  res.status(200).json({ posts });
});

router.get("/explore", protectJWT, async (req: ARequest, res: Response) => {
  const { page = 1, pageSize = 10 } = req.body;

  const posts = await Post.find()
    .sort({
      createdAt: "desc",
    })
    .skip((Number(page) - 1) * Number(pageSize))
    .limit(Number(pageSize));

  res.status(200).json({ posts });
});

export default router;
