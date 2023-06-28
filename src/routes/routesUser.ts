import { Router } from "express";

import User from "../models/User";

import Auth from "./middleware/auth";
import { IReq, IRes } from "./types";

import Paths from "./consts";

const userRouter = Router();

// admin Updating user
userRouter.post(Paths.Users.Update, Auth, async (req: IReq, res: IRes) => {
  if (!req.user) {
    return;
  }

  if (req.user.rank !== 99) {
    return res.status(403).json({ error: "Unauthorized (3)." });
  }

  const { userid, nickname, name, email } = req.body;

  if (!name || !email) {
    return res
      .status(400)
      .json({ error: "Please enter all the required fields." });
  }

  if (name.length > 32) {
    return res
      .status(400)
      .json({ error: "Name is bigger than 32 characters." });
  }

  const isUserNameValid = (val: string) => {
    const usernameRegex = /^[a-z0-9_.]+$/;
    return usernameRegex.test(val);
  };

  if (!isUserNameValid(name)) {
    return res.status(400).json({
      error: "Usernameis not valid. Only characters a-z are acceptable.",
    });
  }

  try {
    const doesUserExist = await User.findOne({ _id: userid });

    if (!doesUserExist) {
      return res.status(400).json({ error: `User doesn't exist` });
    }

    doesUserExist.nickname = nickname;
    doesUserExist.name = name;
    doesUserExist.email = email;

    // save
    const result = await doesUserExist.save();

    return res.status(201).json({
      nickname: result.nickname,
      name: result.name,
      email: result.email,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// admin Fetch all users
userRouter.get(Paths.Users.Get, Auth, async (req: IReq, res: IRes) => {
  if (!req.user) {
    return;
  }

  try {
    if (req.user.rank !== 99) {
      return res.status(403).json({ error: "Unauthorized (3)." });
    }

    const usersList = await User.find().select("-password");

    return res.status(200).json({ usersList });
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
