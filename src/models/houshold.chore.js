import mongoose, { Schema, Types } from "mongoose";
import { frequencyTypeenum,AvailableFrequency, AvailableTaskStatues, TaskStatusEnum } from "../utils/constants.js";


const householdchoreschema = new Schema({
    name :{
        type:String,
        trim:true,
        required:true,
    },
    description:{
        type:String,
        required:false

    },
    household:{
        type:Types.ObjectId,
        ref:"Household",
        required:true,
    },
    dueDate:{
        type:Date
    },
    frequency:{
        type:String,
        enum:AvailableFrequency,
        default:frequencyTypeenum.DAILY
        
    },
    status:{
        type:String,
        enum:AvailableTaskStatues,
        default:TaskStatusEnum.PENDING
    },
    assignedTo:{
        type:Types.ObjectId,
        ref:"HouseholdMember"
}
,lastCompletedAt: {type: Date, 
    default: null 
}, 
 completedAt: { type: Date,  
     default: null}
,

},{timestamps:true})

export const Chore = mongoose.model("Chore",householdchoreschema)