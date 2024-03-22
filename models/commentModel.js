import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"Users",
    },
    description:{
        type:String,
        max:50,
    }
})
export const commentModel=mongoose.model("Comment",commentSchema);
export default commentModel;
 