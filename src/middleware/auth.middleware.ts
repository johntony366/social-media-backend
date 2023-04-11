import { Request, Response, NextFunction } from "express";
import { User, UserSchema } from "../models/user.model";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

export interface ARequest extends Request {
  user: UserSchema;
}

export const protectJWT = expressAsyncHandler(
  async (req: ARequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token, exclude password
        req.user = await User.findById(decoded.user.id).select("-password");

        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);
