import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userschema = new Schema(
    {
        username:{
            type : String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
        },
        fullname:{
            type:String,
            trim:true
        },
        password:{
            type:String,
            required:[true,"Password is required "]

        },
        isEmailVerified:{
            type:Boolean
        },
        refreshToken:{
            type:String
        },
       
        forgetpasswordtoken:{
            type:String
        },
        forgotpasswordexpiry:{
            type:Date
        },
        emailverificationtoken:{
            type:String
        },
        emailverificationExpiry:{
            type:Date
        }
    }
)
userschema.pre("save",async function(next){
    if(!this.isModified("password")) return 
        const hash= await bcrypt.hash(this.password,10);
    this.password=hash;
    
})
userschema.methods.isPasswordCorrect= async function (password) {

    return await bcrypt.compare(password,this.password)

}
userschema.methods.GenerateAccessTOken=function (){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username
            
        },process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}
userschema.methods.GenerateRefreshtoken=function (){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username
            
        },process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}
userschema.methods.generateTemporaryToken=function (){
const unhashedtoken =  crypto.randomBytes(20).toString("hex");
const hashedtoken = crypto.createHash('sha256')
               .update(unhashedtoken)
               .digest('hex');

const tokenexpiry = Date.now()+(60*20*1000)
return {unhashedtoken,hashedtoken,tokenexpiry}
}
export const User =mongoose.model("User",userschema)