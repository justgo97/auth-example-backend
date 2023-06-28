require("dotenv").config({ path: "./config/config.env" });

import express from "express";
import morgan from "morgan";
import connectDB from "./util/db";
import cors from "cors";
import Paths from "./routes/consts";
import mainRouter from "./routes";

const app = express();
const port = 8000;

/* middlewares */

// json format
app.use(express.json());
// Get console log
app.use(morgan("tiny"));

// This is just for testing purposes!
app.use(cors());

/* routes */
app.use(Paths.Base, mainRouter);

app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`[Server]: I am running at https://localhost:${port}`);
  } catch (error) {
    console.log(error);
  }
});
