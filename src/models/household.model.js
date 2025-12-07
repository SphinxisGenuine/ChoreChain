import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";


const householdSchema = new Schema({
name :{
    type:String,
    required:true,
},description:{
 type:String,
}
,
createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

},{timestamps:true}) 
export const Household=mongoose.model("Household",householdSchema)


