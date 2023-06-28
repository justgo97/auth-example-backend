import { Router } from "express";

import bcrypt from "bcrypt";

import User from "../models/User";
import Auth from "./middleware/auth";
import { IReq, IRes } from "./types";
import Paths from "./consts";
import { generateToken } from "../util/tokenUtil";

import validator from "validator";

const authRouter = Router();

authRouter.post(Paths.Auth.Register, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please enter all the required fields." });
  }

  if (name.length > 32) {
    return res
      .status(400)
      .json({ error: "Name is bigger than 32 characters." });
  }

  if (!validator.isAlphanumeric(name)) {
    return res.status(400).json({
      error: "Username is not valid. Only letters and numbers are acceptable.",
    });
  }

  if (password.length < 6 || password.length > 124) {
    return res
      .status(400)
      .json({ error: "Password must be atleast 6 characters long." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email in invalid." });
  }

  try {
    const doesEmailExist = await User.findOne({ email });

    if (doesEmailExist) {
      return res
        .status(400)
        .json({ error: `This email [${email}] is already registred.` });
    }

    const doesUsernameExist = await User.findOne({ name });

    if (doesUsernameExist) {
      return res
        .status(400)
        .json({ error: `This username [${name}] is already used.` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    // save
    const result = await newUser.save();

    const token = generateToken(`${result._id} ${result.lastToken}`);

    return res.status(201).json({ token, user: { ...result.basicData } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Fetch user info to authorize him
authRouter.get(Paths.Auth.Refresh, Auth, async (req: IReq, res: IRes) => {
  if (!req.user) {
    return;
  }

  return res.status(200).json({ user: { ...req.user } });
});

authRouter.post(Paths.Auth.Login, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please enter all the required fields." });
    }

    if (password.length < 6 || password.length > 124) {
      return res
        .status(400)
        .json({ error: "Password must be atleast 6 characters long." });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email in invalid." });
    }

    const doesEmailExist = await User.findOne({ email });

    if (!doesEmailExist) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // if email registered
    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesEmailExist.password!
    );

    if (!doesPasswordMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = generateToken(
      `${doesEmailExist._id} ${doesEmailExist.lastToken}`
    );

    return res
      .status(200)
      .json({ token, user: { ...doesEmailExist.basicData } });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ error: "Server error." });
  }
});

export default authRouter;
