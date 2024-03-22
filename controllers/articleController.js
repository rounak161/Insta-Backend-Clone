import articleModel from "../models/articleModel.js";
import userModel from "../models/userModel.js";

export const createArticle = async (req, res) => {
    try {
        const { description } = req.body;
        //req.body.user=req.user._id;
        const article = await articleModel.create({
            user: req.user._id, // Corrected to req.user._id
            description: description
        });
        res.status(201).send({
            success: true,
            message: "Article created Successfully",
            article: article
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in creating article",
            error: error.message // Include the error message in the response
        });
    }
};
export const updateArticle = async (req, res) => {
    try {
        const article = await articleModel.findById(req.params.id);
        if (req.user._id.toString() === article.user.toString()) { // Corrected comparison
            await article.updateOne({ $set: req.body });
            res.status(200).send({
                status: "success",
                message: "Article has been updated",
            });
        } else {
            res.status(401).send({
                status: "failure",
                message: "You are not authorized",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in updating article",
            error: error.message
        });
    }
}


export const deleteArticle=async(req,res)=>{
    try{
       const article=await articleModel.findById(req.params.id);
       if(req.user._id.toString()===article.user.toString()){
                await articleModel.findByIdAndDelete(req.params.id);
                res.status(200).send({
                    status: "success",
                    message: "article has been deleted",
                })
       }else{
            res.status(401).send({
                status: "failure",
                message: "you are not authorized",
            });
       }
    }catch(error){
            res.status(500).send({
                success: false,
                message: "Error in updating article",
                error: error.message
            });
    }
}


export const gettimeline = async (req, res) => {
    try {
        const userid = req.user._id;
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 1;

        // Fetch user's followings
        const user = await userModel.findById(userid).select("followings");

        // Fetch user's own articles
        const myarticles = await articleModel.find({ user: userid })
            .skip(page * limit)
            .limit(limit)
            .sort({ createdAt: "desc" })
            .populate("user", "name profilePic");

        // Fetch articles of user's followings
        const followingsArticles = await Promise.all(
            user.followings.map(async (followingId) => {
                return await articleModel.find({
                    user: followingId,
                    createdAt: { $gte: new Date(new Date().getTime() - 86400000).toISOString() }
                })
                .populate("user", "name profilePic");
            })
        );

        // Combine user's own articles with articles of followings
        const allArticles = [myarticles, ...followingsArticles].flat();

        res.status(200).send({
            status: "success",
            articles: allArticles,
            limit: allArticles.length
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error",
            error: error.message
        });
    }
};


export const getArticle=async(req,res)=>{
    try{
         //const user=await userModel.findOne({name:req.params.name});
         const articles=await articleModel.findById(req.params.id);
         console.log(req.params.id)
         res.status(200).send({
            status: "success",
            message: "article has been fetched",
            articles
        })
    }catch(error){
        res.status(500).send({
            success: false,
            message: "Error in updating article",
            error: error.message
        });
    }
}

 
export const getarticle = async (req, res) => {
    try {
        const article = await articleModel.findById(req.params.id);
        res.status(500).send({
            status: "success",
            message: "Article has been fetched",
            article         
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in updating article",
            error: error.message
        });
    }
}

export const likeUnlike =async(req,res)=>{
    try{
       const article=await articleModel.findById(req.params.id);
       if(!article.likes.includes(req.user._id)){
             await article.updateOne({
                $push:{likes:req.user._id},
             })
             res.status(200).send({
                status: "success",
                message: "the article has been liked",
              });
       }else{
            await article.updateOne({
                $pull:{likes:req.user._id},
            })
            res.status(200).send({
                status: "success",
                message: "the article has been disliked",
              });
       }
    }catch(error){
        res.status(500).send({
            success: false,
            message: "Error in updating article",
            error: error.message
        });
    }
}
