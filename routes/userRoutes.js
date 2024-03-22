import express from "express";
import {
   
  followUser,
  getfFollowings,
  getfollowers,
  registerController, searchuser, unfollowuser, updateProfile,
 
} from "../controllers/userController.js";
import { loginController } from "../controllers/userController.js";
import { logoutController } from "../controllers/userController.js";
import { getUserProfileController } from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { likeUnlike } from "../controllers/articleController.js";
 

 
//router object
const router = express.Router();

//routes
// register
router.post("/register", registerController);


//login
router.post("/login",  loginController);

//logout
router.get("/logout",  logoutController);

//profile
router.get("/profile", isAuth, getUserProfileController);

//update profile  your 
router.put("/update", isAuth, updateProfile);

//get user by username
router.get("/getuserbyname/:name", isAuth, updateProfile);

//get followings of the user
router.get("/followings/:username", isAuth,getfFollowings);

//get followers of the user
router.get("/followers/:username", isAuth,getfollowers);

//get follow user of the user
router.put("/usertofollow/:name",isAuth, followUser);

//get follow user of the user
// router.get("/usertofollow/:name",isAuth, followUser);

//get follow user of the user
router.put("/usertounfollow/:name",isAuth,unfollowuser );
//search
router.get("/searchUser",searchuser);
 
//export
export default router;