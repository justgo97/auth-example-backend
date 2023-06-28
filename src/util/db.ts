import mongoose from "mongoose";

const connectDB = async () => {
  return mongoose
    .connect(process.env.DB_URI as string)
    .then(() => console.log("MongoDB is Connected..."))
    .catch((err: any) => console.log(err));
};

export default connectDB;
