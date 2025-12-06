import { Apiresponse } from "../utils/ApiResponse.js"; 
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/User.model.js"
import {sendmailverification} from "../utils/email.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
const generateaccesandrefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid);

    if (!user) {
      throw new ApiError(404, "User not found while generating token");
    }

    const Accesstoken = user.GenerateAccessTOken();
    const refreshToken1 = user.GenerateRefreshtoken();

    user.refreshToken = refreshToken1;
    await user.save({ validateBeforeSave: false });

    return { Accesstoken, refreshToken1 };
  } catch (error) {
    console.error("Error in generateaccesandrefreshtoken:", error);
    throw new ApiError(402, "Something Went wrong while Generating token", [error]);
  }
};
const registeruser = asyncHandler( async (req,res)=>{
const {email,username,password}=req.body
 const UserExist = await User.findOne({$or:[{username},{email}]})
if(UserExist){
    throw new ApiError(402,"User With same Email Or username Exist ")
}
const user =await User.create({
    email,
    username,
    password
})
const {unhashedtoken,hashedtoken,tokenexpiry} = user.generateTemporaryToken()
user.emailverificationtoken=hashedtoken;
user.emailverificationExpiry=tokenexpiry;
await user.save({validateBeforeSave:false})


const options ={
email:email,
username:username,
link:`${req.protocol}://${req.get("host")}/api/v1/verify-email/${unhashedtoken}`,
 subject: "Verify your email",
}
await sendmailverification(options)
const createduser=await User.findById(user._id).select(
        "-password -refreshtoken -emailverificationtoken -emailverificationExpiry"
    )
      if (!createduser){
        throw new ApiError (500,"Something Wentwrong while registring the usser")
        
        
    }

res.status(201).json (
new Apiresponse(201,{user:createduser},"User registered Succefully verification Email Has Been Sent to ur email ")
)

})
const login =asyncHandler(async (req,res)=>{
const {username,email,password}=req.body;
const user = await User.findOne({$or:[{email},{username}]})
if (!user){
     throw new ApiError(404,"User With that Email Dosent Exist ")
}
const isCorrect = await user.isPasswordCorrect(password);
if(!isCorrect){
    throw new ApiError (400,"Invalid Credential ")
}

const {Accesstoken,refreshToken1} = await generateaccesandrefreshtoken(user._id)
const loginuser=await User.findById(user._id).select(
        "-password -refreshtoken -emailverificationtoken -emailverificationExpiry"
    )
    const option ={
    httpOnly:true,
    secure:true
   }

    return res.status(200)
   .cookie("accessToken",Accesstoken,option)
   .cookie("refreshToken",refreshToken1,option)
   .json(
    new Apiresponse(200,{
        user:loginuser,
        Accesstoken,
        refreshToken1

    },"User logged Succefuly")
   )


});
const verifytoken  =asyncHandler(async (req,res)=>{
  const {verificationtoken}=req.params;
    if (!verificationtoken) {
        throw new ApiError(400, "Email verification token is missing");
    }

const hashedToken = crypto
        .createHash("sha256")  
        .update(verificationtoken)
        .digest("hex");
        const user = await User.findOne({
        emailverificationtoken: hashedToken,
        emailverificationExpiry: { $gt: Date.now() } 
    });
    

if (!user){
  throw new ApiError(400,"Invalid or expired token ")

}
user.isEmailVerified=true;
user.emailverificationtoken=undefined;
user.emailverificationExpiry=undefined;
await user.save()

res.status(200).json({
success:true,
mwssage:"Email is verified"
})
});
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exists", []);
  }

  const { unhashedtoken,hashedtoken,tokenexpiry} =
    await user.generateTemporaryToken();

  user.forgetpasswordtoken = hashedtoken;
  user.forgotpasswordexpiry = tokenexpiry;

  await user.save({ validateBeforeSave: false });
  console.log(unhashedtoken)
const options ={
email:email,
username:user.username  ,
link:`${req.protocol}://${req.get("host")}/api/v1/reset-password/${unhashedtoken}`,
 subject: "Forget password",
}
await sendmailverification(options)
  
  return res
    .status(200)
    .json(
      new Apiresponse(
        200,
        {},
        "Password reset mail has been sent on your mail id",
      ),
    );
});
const resetPassword= asyncHandler( async (req,res)=>{
const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgetpasswordtoken: hashedToken,
    forgotpasswordexpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, "Token is invalid or expired");
  }

  user.forgetpasswordtoken = undefined;
  user.forgotpasswordexpiry = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Password reset successfully"));
}); 
const logout =asyncHandler(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200, {}, "User logged out"));
});
const changepassword = asyncHandler(async (req,res)=>{
  const {oldpassword,newPassword}=req.body;
const user=await User.findById(req.user?._id);
console.log(user.username)
  const isPasswordValid = await user.isPasswordCorrect(oldpassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old Password");
  }
   user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Password changed successfully"));
})  
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }


    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);
    
    if (!user) {
      throw new ApiError(401, "Invalid refresh token1");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token in expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateaccesandrefreshtoken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new Apiresponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  // } catch (error) {
  //   throw new ApiError(401, "Invalid refresh token");
  // }
});
const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is already verified");
  }

  const { unhashedtoken,hashedtoken,tokenexpiry } =await user.generateTemporaryToken();

  user.emailverificationtoken = hashedtoken;
  user.emailverificationExpiry = tokenexpiry;

  await user.save({ validateBeforeSave: false });

 const options ={
email:user.email,
username:user.username,
link:`${req.protocol}://${req.get("host")}/api/v1/verify-email/${unhashedtoken}`,
 subject: "Verify your email",
}
await sendmailverification(options)
const createduser=await User.findById(user._id).select(
        "-password -refreshtoken -emailverificationtoken -emailverificationExpiry"
    )
      if (!createduser){
        throw new ApiError (500,"Something Wentwrong while registring the usser")
        
        
    }

  return res
    .status(200)
    .json(new Apiresponse(200, {}, "Mail has been sent to your email ID"));
});
export{
    registeruser,
    login,
    verifytoken,
    forgotPasswordRequest,
    resetPassword,
    logout,
    changepassword
    ,refreshAccessToken,
    resendEmailVerification
}