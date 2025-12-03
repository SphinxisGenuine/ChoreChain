import { Apiresponse } from "../utils/ApiResponse.js"; 
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/User.model.js"
import sendmailverification from "../utils/email.js";
import mongoose from "mongoose"


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
link:`${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${unhashedtoken}`,
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


export{
    registeruser
}