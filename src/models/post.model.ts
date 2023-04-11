import mongoose, { Schema, Types } from "mongoose";

export interface PostSchema {
  author: Schema.Types.ObjectId;
  title: string;
  content: string;
  likes: Types.ObjectId[];
}

const postSchema = new Schema<PostSchema>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      min: 3,
      max: 150,
    },
    content: {
      type: String,
      required: true,
      min: 3,
      max: 500,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Post = mongoose.model<PostSchema>("Post", postSchema);
