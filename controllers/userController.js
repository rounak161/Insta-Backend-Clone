import userModel from "../models/userModel.js";
 
export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;
    // validation
    if (
      !name ||
      !email ||
      !password 
    ) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    //check exisiting user
    const exisitingUSer = await userModel.findOne({ email });
    //validation
    if (exisitingUSer) {
      return res.status(500).send({
        success: false,
        message: "email already taken",
      });
    }
    const user = await userModel.create({
      name,
      email,
      password
       
    });
    res.status(201).send({
      success: true,
      message: "Registeration Success, please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

 //LOGIN
export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(500).send({
          success: false,
          message: "Please Add Email OR Password",
        });
      }
      // check user
      const user = await userModel.findOne({ email });
      //user valdiation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "USer Not Found",
        });
      }
      //check pass
      const isMatch = await user.comparePassword(password);
      //valdiation pass
      if (!isMatch) {
        return res.status(500).send({
          success: false,
          message: "invalid credentials",
        });
      }
      //teken
      const token = user.generateToken();
  
      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          secure: process.env.NODE_ENV === "development" ? true : false,
          httpOnly: process.env.NODE_ENV === "development" ? true : false,
          sameSite: process.env.NODE_ENV === "development" ? true : false,
        })
        .send({
          success: true,
          message: "Login Successfully",
          token,
          user,
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: "false",
        message: "Error In Login Api",
        error,
      });
    }
  };
  // LOGOUT
export const logoutController = async (req, res) => {
    try {
      res
        .status(200)
        .cookie("token", "", {
          expires: new Date(Date.now()),
          secure: process.env.NODE_ENV === "development" ? true : false,
          httpOnly: process.env.NODE_ENV === "development" ? true : false,
          sameSite: process.env.NODE_ENV === "development" ? true : false,
        })
        .send({
          success: true,
          message: "Logout SUccessfully",
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In LOgout API",
        error,
      });
    }
  };
  

  // GET USER PROFILE
export const getUserProfileController = async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      user.password = undefined;
      res.status(200).send({
        success: true,
        message: "USer Prfolie Fetched Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In PRofile API",
        error,
      });
    }
  };

//const update
export const updateProfile=async (req,res)=>{
  try{
    const{name,email,password,description}=req.body;
    const user=await userModel.findById(req.user._id);
    if(user.role==="user"){
      if(name)  user.name=name;
      if(email) user.email=email;
      if(password) user.password=password;
      if(description) user.description=description;
      await user.save();
      res.status(200).send({
        success: true,
        message: "USer Prfolie updated Successfully",
        user,
      });
    }else{
      
      res.status(500).send({
        success: false,
        message: "you can update only your profile",
         
      });
  
    }
     
  }catch(error){
    console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In PRofile API",
        error,
      });
  }
}


//get user byname
export const getUserByname=async(req,res)=>{
  try{
        const name= req.params.name;
        const user=await userModel.findOne({name:name});
        if(!user){
          res.status(500).send({
            success: false,
            message: "User Not Found",
            error,
          });
        }
        res.status(200).send({
          success: true,
          message: "User with username  found Successfully",
          user,
        });
    

  }catch(error){
    console.log(error);
      res.status(500).send({
        success: false,
        message: "Error In PRofile API",
        error,
      });
  }
}


 
export const getfFollowings = async (req, res) => {
  try {
    const name = req.params.username;
    const userfollowings = await userModel.findOne({ name: name });
    if (!userfollowings) {
      throw new Error("user does not exist");
    }
    const followings = await Promise.all(
      userfollowings.followings.map((following) => {
        return userModel.findById(following, {
          name: true,
          profilePicture: true,
        });
      })
    );
    res.status(200).send({
      status: "success",
      message: "user info",
      followings: followings,
    });
  } catch (e) {
    res.status(500).send({
      status: "failure",
      message: e.message,
    });
  }
};

export const  getfollowers=async(req,res)=>{
  try{
     
    const name=req.params.username;
    const user=await userModel.findOne({name:name});
    if(!user){
      return registerController.status(500).send({
        success:false,
        message:"user does not exist",
      })
    }
     const followers=await Promise.all(
      user.followers.map((follower)=>{
        return userModel.findById(follower,{
             name:true,
             profilePicture:true
        })
      })
     )
     res.status(200).send({
      status: "success",
      message: "user info",
      data: {
        followers: followers,
      },
    });
  }catch(error){
    res.status(500).send({
      status: "failure",
      message: e.message,
    }); 
  }
}


export const followUser = async (req, res) => {
  try {
   
    const usertofollow = await userModel.findOne({ name:req.params.name });
    const user = await userModel.findById(req.user._id);
    if(!usertofollow){
      return res.status(500).send({
        success:false,
        message: "user not found ",
       
      });

      
} 
     if(usertofollow!==user){
            
            if(!user.followings.includes(usertofollow._id)){
            
             await user.updateOne({
                $push:{followings:usertofollow._id}
             })
            await usertofollow.updateOne({
              $push:{followers:user._id}
            })

              return res.status(500).send({
                success: true,
                message: "yeah you can follow it and it does not include the usertofollow in its following  ",
               
              });
  
            }else{
              return res.status(500).send({
                success: true,
                message: "yeah you cannot follow it and it is already included in  user's following  array  ",
               
              });
            }



            
     } else{
            return res.status(500).send({
              success: false,
              message: "you cannot follow yourself",
               
            });
     }
    

     
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in following user",
      error: error.message,
    });
  }
};

export const unfollowuser=async(req,res)=>{
  try{
    const user=await userModel.findById(req.user._id);
    const usertounfollow=await userModel.findOne({name:req.params.name});
    if(!usertounfollow){
        return res.status(500).send({
          success: false,
          message: "usertofollow is not found in database",
          
        });
    }
    if(user!==usertounfollow){
           if(user.followings.includes(usertounfollow._id)){
              await user.updateOne({
                 $pull:{followings:usertounfollow._id},
              })  
              
              await usertounfollow.updateOne({
                $pull:{followers:req.user._id},
              })
              res.status(200).send({
                status: "success",
                message: "user has been unfollowed",
              });
           }else{
                return res.status(500).send({
                  success: false,
                  message: "you are not following this user",
                  
                });
           }
    }else{
          return res.status(500).send({
            success: false,
            message: "you cannot unfollow yourself",
             
          });
    }
  }catch(error){
    console.error(error);
        return res.status(500).send({
          success: false,
          message: "Error in following user",
          error: error.message,
        });
  }
  
}
 

export const searchuser=async(req,res)=>{
  try{
        const  limit =parseInt(req.query.limit) ||5;
        const search=req.query.search||"";
        const users=await userModel.find({
          name:{$regex:search,$options:"i"},
        })
        .select("_id username profilePicture")
        .limit(limit);
        const totalUsers=users.length;
        res.status(200).send({
          status:true,
         totalUsers:totalUsers,
         limit:limit,
         users:users,

        })
  }catch(error){
          console.error(error);
          return res.status(500).send({
            success: false,
            message: "Error in following user",
            error: error.message,
          });
  }
} 