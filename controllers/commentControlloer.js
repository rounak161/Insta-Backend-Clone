import articleModel from "../models/articleModel.js";
import commentModel from "../models/commentModel.js";

export const addcoment=async(req,res)=>{
    try{
         const {comment}=req.body;
         const articleid=req.params.id;
        const commentmodel = await commentModel.create({
            user: req.user._id, // Corrected to req.user._id
            description: comment
        });
        const articlemodel=await articleModel.findById(articleid);
        await articlemodel.updateOne({
            $push:{comment:commentmodel._id}
        })
        res.status(200).send({
            status: "success",
            message: "Comment has been created",
          });
    }catch(error){
        res.status(500).send({
            status: "failure",
            message: error.message,
          });
    }
}


export const getByPostId=async(req,res)=>{
    try{
        const articleid=req.params.id;
        const articles=await articleModel.findById({_id:articleid}).populate("comment")
        res.status(200).send({                     
            status:"success",
            comments:articles.comment,
        })
    }catch(error){
            res.status(500).send({
                status: "failure",
                message: error.message,
            });
    }
}