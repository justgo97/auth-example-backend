import User from "../../models/User";

import { NextFunction } from "express";
import { IReq, IRes } from "../types";
import { verifyToken } from "../../util/tokenUtil";

const Auth = (req: IReq, res: IRes, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: "Forbidden. (1)" });
  }

  const token = authHeader.split(" ")[1];

  verifyToken(token)
    .then(async (payload) => {
      if (!payload) {
        return;
      }

      const userInfo = payload.token.split(" ");

      const user = await User.findOne({ _id: userInfo[0] }).select("-password");

      if (!user) {
        return res.status(403).json({ error: "Unauthorized (2)." });
      }

      // If we found our user
      req.user = { ...user.basicData };

      // Go to
      next();
    })
    .catch(() => {
      res.sendStatus(403); // Token verification failed
    });
};

export default Auth;
