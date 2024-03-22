import mongoose from "mongoose";

const articleSchema= new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"Users",
    },
    description:{
          type:String,
          max:500,
    },
    imgurl:{
        type:String,
    },
    likes:[{ 
        type:mongoose.Types.ObjectId,
        ref:"Users",
    }],
    comment:[{
         type:mongoose.Types.ObjectId,
         ref:"Comment"
    }]
},
{timestamps:true}
)
export const articleModel=mongoose.model("Article",articleSchema);
export default articleModel;