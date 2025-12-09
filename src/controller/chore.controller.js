import asyncHandler from "../utils/asyncHandler.js"
import { Chore } from "../models/houshold.chore.js"
import { ApiError } from "../utils/ApiError.js"
import { AvailableFrequency, AvailableTaskStatues, frequencyTypeenum, TaskStatusEnum } from "../utils/constants.js"
import { HouseholdMember } from "../models/household.member.model.js"
import { Apiresponse } from "../utils/ApiResponse.js"
import { Household } from "../models/household.model.js"

const createchore = asyncHandler( async (req,res) => {
const {name,description,dueDate,assignedTo,frequency,householdid}=req.body
// todo will write a middleware to check for owner and modify req to req.Householddid  will have project id
const isSameChoreAvailable = await Chore.findOne({name,household:householdid})
if  (isSameChoreAvailable){
throw new ApiError(400,{},"Chore with Same Name Exist ")
}
if(!AvailableFrequency.includes(frequency)){
throw new ApiError(400,{},`Freqency shyoulbe valid it should be from ${AvailableFrequency}`);    
}
const  isMemberofHousehold = await HouseholdMember.findOne({user:assignedTo,household:householdid})
if(!isMemberofHousehold) {
    throw new ApiError(404,{},"The user you're assigning to must be a member of this household");
}
const newChore =  await Chore.create({
    name,
    description,
    assignedTo:isMemberofHousehold._id, 
    frequency,
household:householdid,
dueDate,
})
res.status(201).json(
    new Apiresponse(201,newChore,"New Chore has been Created ")
)
}) 
const getAllChores = asyncHandler( async (req,res) => {
    const {householdId}= req.params;
    // i should add a middleware to chexk if the req is bby user who is part of household 

    const householddoc =await  Household.findOne({_id:householdId})
if(!householddoc){
    throw new ApiError(404,{},"No Household found with these id ")
}

    const chores = await Chore.find({household:householddoc._id}).populate({path:"assignedTo",populate:{path:"user",select:"email username"}})


res.status(200).json(
    new Apiresponse(200,chores,"Fetched The Chhores Succesfully ")
)
})

const choreComplete= asyncHandler( async (req,res) => {
    const {householdId,choreid}=req.params;
    const householddoc =await  Household.findOne({_id:householdId})
if(!householddoc){
    throw new ApiError(404,{},"No Household found with these id ")
}
const isChoreExist =  await Chore.findOne({household:householddoc._id,_id:choreid})

if (!isChoreExist){
    throw new ApiError(404,{},"No Chore found with these id ")
}
const frequency =isChoreExist.frequency;

const now = new Date();
const current = isChoreExist.dueDate;
const msInDay = 24 * 60 * 60 * 1000;
if (frequency===frequencyTypeenum.ONCE) {isChoreExist.completedAt=now;
 isChoreExist.lastCompletedAt=now;
 isChoreExist.dueDate=null;
 isChoreExist.status=TaskStatusEnum.DONE
await isChoreExist.save({validateBeforeSave:false})
res.status(200).json(
    new Apiresponse(200,isChoreExist,"Task Has Been Set to be completed ")
)}
else if (frequency===frequencyTypeenum.DAILY){
isChoreExist.lastCompletedAt=now;
isChoreExist.dueDate=new Date(current.getTime() + 1 * msInDay);    
await isChoreExist.save({validateBeforeSave:false})
res.status(200).json(
    new Apiresponse(200,isChoreExist,"Task Has Been Set to be completed and Next Due Date Has been set  ")
)} 
else if (frequency===frequencyTypeenum.WEEKLY){
    isChoreExist.lastCompletedAt=now;
  isChoreExist.dueDate  =new Date(base.getTime() + 7 * msInDay);
    await isChoreExist.save({validateBeforeSave:false})
 res.status(200).json(
    new Apiresponse(200,isChoreExist,"Task Has Been Set to be completed  and Next Due Date Has been set")
)   
} 
else if (frequency===frequencyTypeenum.MONTHLY){
    
    isChoreExist.lastCompletedAt=now;
    const next = new Date(current);
next.setMonth(next.getMonth() + 1);
isChoreExist.dueDate=next;
    await isChoreExist.save({validateBeforeSave:false})
res.status(200).json(
    new Apiresponse(200,isChoreExist,"Task Has Been Set to be completed and Next Due Date Has been set")
)
} 




})