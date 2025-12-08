import { Schema, Types } from "mongoose";
import { frequencyTypeenum,AvailableFrequency, AvailableTaskStatues, TaskStatusEnum } from "../utils/constants";


const householdtaskschema = new Schema({
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
        type:Date,
        required:true
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


},{timestamps:true})