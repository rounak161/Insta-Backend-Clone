import express from "express";
import { createArticle, deleteArticle, getArticle,   getarticle, gettimeline, likeUnlike, updateArticle } from "../controllers/articleController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
 
 

//router object
const router = express.Router();

//routes
//create Article
router.post("/create" ,isAuth,  createArticle);

//update article
router.put("/:id",isAuth,updateArticle);

//delete  the article 
router.delete("/:id",isAuth,deleteArticle);

//get article by user name 
router.get("/:name",getArticle);

//get article by user name 
router.get("/name/:id",getarticle);


//likeUnlikes
router.get("/like/:id",isAuth, likeUnlike);

//timeline
router.get("/timeline/article", isAuth,  gettimeline);
  
export default router;