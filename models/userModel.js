import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
      name: {
      type: String,
      required: true,
      min: 3,
      max: 15,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      min: 4,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    description: {
      type: String,
      max: 50,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "YOUR_DEFAULT_AVATAR_URL",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      // required: true,
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
  },
  { timestamps: true }
);

//fuynctuions
// hash func
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
  });
// compare function
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  };
//JWT TOKEN
userSchema.methods.generateToken = function () {
    return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };
export const userModel = mongoose.model("Users", userSchema);
export default userModel;

 