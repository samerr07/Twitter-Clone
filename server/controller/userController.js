const { User } = require("../model/userSchema");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2


//Register a User

exports.createUser = async(req,res)=>{

    try{
        const {name, userName, email, password} = req.body;

        // basic validation

        if(!name || !userName || !email || !password){
            return res.status(401).json({
                success:false,
                message:"Please fill all the fields !!"
            })
        }

        // check if user already exists

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User already exists !!"
            })
        }

        const hashedPassword = await bycrypt.hash(password, 16);

        const user = await new User({
            name,
            userName,
            email,
            password:hashedPassword
        })
        await user.save();

        return res.status(201).json({
            success:true,
            message:"User created Sucessfully !!",
            user
        })

    } catch(err){
        res.status(500).json({
            success:false,
            message:"User not created Sucessfully !!",
            err
        })
    }
}

// Login a User

exports.loginUser = async(req,res)=>{
    try{
        const {email, password} = req.body;

        // basic validation

        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Please fill all the fields !!"
            })
        }

        //check email & password

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Emails or Password is incorrect !!"
            })
        }

        const isMatch = await bycrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(401).json({
                success:false,
                message:"Password is incorrect !!"
            })
        }

        // generate token
        const tokenData = {
            userId : user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET,{expiresIn: "1d"});
        
        // set the token in browser cookie
        return res.cookie("accessToken",token,{
            httpOnly:true,
            expires:token.expiresIn,
            
        }).status(200).json({
            success:true,
            message:`Welcome back ${user.name} !!`,
            user,
            token
        })
       

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Emails or Password is incorrect !!",
            err
        })
    }
}

//get current user details

exports.currentUserDetails = async(req,res)=>{
    try{
        const loggedInUserId = req.params.id;

        const user = await User.findById(loggedInUserId);

        return res.status(200).json({
            success:true,
            message:"User details fetched successfully !!",
            user
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Error while getting current user details !!",
            err
        })
    }
}


//Logout

exports.logoutUser = async(req,res)=>{
    try{
        res.clearCookie("accessToken",{
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });


        return res.status(200).json({
            success:true,
            message:"Logged out successfully !!"
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"Logout failed !!",
            err
        })
    }
}

// This logic can also used for logout

// export const logout = (req, res) => {
//     // Clear the token cookie by setting its expiration date to the past
//     res.cookie("token", "", { expires: new Date(0), httpOnly: true, secure: true, sameSite: 'Strict' });

//     // Send a success response
//     return res.status(200).json({
//         message: "User logged out successfully.",
//         success: true
//     });
// };


//bookmark the tweet


exports.bookmarkTweet = async(req,res)=>{
    try{
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;

        const user = await User.findById(loggedInUserId);

        if(user.bookmarks.includes(tweetId)){
            // Remove from bookmarks
            await User.findByIdAndUpdate(loggedInUserId, {
                $pull: { bookmarks: tweetId }
            });
        } else {
            // Add to bookmarks
            await User.findByIdAndUpdate(loggedInUserId, {
                $push: { bookmarks: tweetId }
            });
        }

        // Return updated bookmarks
        const updatedUser = await User.findById(loggedInUserId).select('bookmarks');
        return res.status(200).json({
            success: true,
            message: user.bookmarks.includes(tweetId) ? "Tweet removed from bookmark !!" : "Tweet bookmarked !!",
            bookmarks: updatedUser.bookmarks
        });
    } catch(err){
        return res.status(500).json({
            success: false,
            message: "Bookmark failed !!",
            err
        });
    }
};



exports.getProfile = async(req,res)=>{
    try{
        const id = req.params.id;

        const user = await User.findById(id).select("-password");

        return res.status(200).json({
            success:true,
            user,
            message:"User Profile fetched Successfully !!!"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Profile fetch failed !!",
            err
        })
    }
}


exports.getOtherUsers = async(req,res)=>{
    try{
        const id = req.params.id;
        
        const otherUsers = await User.find({_id:{$ne:id}}).select("-password");

        return res.status(200).json({
            success:true,
            message:"Other users fetched Successfully !!",
            otherUsers
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to fetch all users !!",
            err
        })
    }
}

//follow

exports.followUser = async(req,res)=>{
    try{
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedUser = await User.findById(loggedInUserId); //Sameer
        const user = await User.findById(userId); //Rishabh

        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}})
            await loggedUser.updateOne({$push:{following:userId}})
        }else{
            return res.status(403).json({
                success:false,
                message:"You already follow this user !!",
                user
            })
        }       

        return res.status(200).json({
            success:true,
            message: `${user.name} follwed ${loggedUser.name} successfully !!`
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to follow user !!",
            err
        })
    }
}

//Unfollow

exports.unFollowUser = async(req,res)=>{
    try{
        const loggedInUserId = req.body.id;
        const userId = req.params.id;

        const loggedUser = await User.findById(loggedInUserId); //Sameer
        const user = await User.findById(userId); //Rishabh

        if(user.followers.includes(loggedInUserId)){
            await user.updateOne({$pull:{followers:loggedInUserId}})
            await loggedUser.updateOne({$pull:{following:userId}})
        }else{
            return res.status(403).json({
                success:false,
                message:`User has not followed yet !!`
            })
        }       

        return res.status(200).json({
            success:true,
            message: `${user.name} unfollwed ${loggedUser.name} successfully !!`
        })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Failed to follow user !!",
            err
        })
    }
}

// exports.updateUser = async(req,res)=>{
//     try{
//         const {name, userName,bio,id} = req.body;
//         let {coverImg, profileImg} = req.body;
//         // const userId = req.body;

//         let user = await User.findById(id);

//         if (profileImg) {
// 			if (user.profileImg) {
// 				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
// 				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
// 			}

// 			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
// 			profileImg = uploadedResponse.secure_url;
// 		}

//         if (coverImg) {
// 			if (user.coverImg) {
// 				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
// 			}

// 			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
// 			coverImg = uploadedResponse.secure_url;
// 		}

//         user.name = name || user.name;
// 		user.email = email || user.email;
// 		user.userName = userName || user.userName;
// 		user.bio = bio || user.bio;
// 		user.profileImg = profileImg || user.profileImg;
// 		user.coverImg = coverImg || user.coverImg;

//         user = await user.save();

//         return res.status(200).json({
//             success:true,
//             user
//         });
//     }catch(err){
//         return res.status(500).json({
//             success:false,
//             message:"Failed to update user !!",
//             err
//         })
//     }
// }
exports.updateUser = async (req, res) => {
    try {
      const { name, userName, email, bio, id } = req.body;
      let { coverImg, profileImg } = req.body;
  
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Handling profile image update
      if (profileImg) {
        if (user.profileImg) {
          await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
        }
        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedResponse.secure_url;
      }
  
      // Handling cover image update
      if (coverImg) {
        if (user.coverImg) {
          await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
        }
        const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse.secure_url;
      }
  
      // Updating user fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.userName = userName || user.userName;
      user.bio = bio || user.bio;
      user.profileImg = profileImg || user.profileImg;
      user.coverImg = coverImg || user.coverImg;
  
      user = await user.save();
  
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
        err,
      });
    }
  };


//   exports.updateImage = async(req,res)=>{
//     try {
//         const {  id } = req.body;
//         let { coverImg, profileImg } = req.body;

//         // console.log(coverImg);
//         // console.log(profileImg)
    
//         let user = await User.findById(id);
//         if (!user) {
//           return res.status(404).json({
//             success: false,
//             message: "User not found",
//           });
//         }
    
//         // Handling profile image update
//         if (profileImg) {
//           if (user.profileImg) {
//             await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
//           }
//           const uploadedResponse = await cloudinary.uploader.upload(profileImg);
//           profileImg = uploadedResponse.secure_url;
//         }
    
//         // Handling cover image update
//         if (coverImg) {
//           if (user.coverImg) {
//             await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
//           }
//           const uploadedResponse = await cloudinary.uploader.upload(coverImg);
//           coverImg = uploadedResponse.secure_url;
//         }
    
//         // Updating user fields
//         user.profileImg = profileImg || user.profileImg;
//         user.coverImg = coverImg || user.coverImg;
    
//         user = await user.save();
    
//         return res.status(200).json({
//           success: true,
//           user,
//         });
//       } catch (err) {
//         return res.status(500).json({
//           success: false,
//           message: "Failed to update user",
//           err,
//         });
//       }
//   }

exports.updateImage = async(req,res)=>{
    try {
        const { id } = req.body;
        let {coverImg, profileImg} = req.body;

        console.log("Received data: ", { id, coverImg, profileImg });

        let user = await User.findById(id);
        if (!user) {
          console.log("User not found");
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
    
        // Profile Image Update
        if (profileImg) {
          console.log("Updating profile image...");
          if (user.profileImg) {
            console.log("Deleting old profile image...");
            await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
          }
          const uploadedResponse = await cloudinary.uploader.upload(profileImg);
          profileImg = uploadedResponse.secure_url;
          console.log("Profile image updated:", profileImg);
        }
    
        // Cover Image Update
        if (coverImg) {
          console.log("Updating cover image...");
          if (user.coverImg) {
            console.log("Deleting old cover image...");
            await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
          }
          const uploadedResponse = await cloudinary.uploader.upload(coverImg);
          coverImg = uploadedResponse.secure_url;
          console.log("Cover image updated:", coverImg);
        }
    
        user.profileImg = profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
    
        user = await user.save();
        console.log("User updated:", user);
    
        return res.status(200).json({
          success: true,
          user,
        });
      } catch (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to update user",
          err,
        });
      }
}

  