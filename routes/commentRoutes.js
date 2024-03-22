import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { addcoment, getByPostId } from "../controllers/commentControlloer.js";
 
 

//router object
const router = express.Router();

//routes
//create  comment
router.post("/create/:id" ,isAuth, addcoment );

//all the comments
router.get("/:id", getByPostId);
 
  
export default router;