import { Router } from "express";
import Paths from "./consts";
import authRouter from "./routesAuth";
import userRouter from "./routesUser";

const mainRouter = Router();

mainRouter.use(Paths.Auth.Base, authRouter);
mainRouter.use(Paths.Users.Base, userRouter);

export default mainRouter;
