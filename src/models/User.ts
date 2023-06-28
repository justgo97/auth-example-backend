import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required."],
    },
    email: {
      type: String,
      required: [true, "email is required."],
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    nickname: {
      type: String,
    },
    rank: {
      type: Number,
      default: 0,
    },
    lastToken: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    virtuals: {
      // These basic data will be sent to frontend so don't add anything sensitive here!
      basicData: {
        get() {
          return {
            nickname: this.nickname,
            name: this.name,
            email: this.email,
            rank: this.rank,
          };
        },
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
