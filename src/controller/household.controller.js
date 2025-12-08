import { Household } from "../models/household.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HouseholdMember } from "../models/household.member.model.js";
import { ApiError } from "../utils/ApiError.js";
import { UserRolesEnum } from "../utils/constants.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";

const createHousehold=asyncHandler(async (req,res) => {
    const {name,description}=req.body;
const Householdexist = await Household.findOne({ name, createdBy: req.user._id})
if(Householdexist){
    throw new ApiError(400,"Household With same name Exist ")
}
    const household =await Household.create({
        name,
        description,
        createdBy:req.user._id
        
    })
    
    const newHousholdmember=await HouseholdMember.create({
user: req.user._id,
    household: household._id,
    role:UserRolesEnum.ADMIN 
})


res.status(201).json (
    new Apiresponse(201,{Household:household,householdId:household._id},"New Household Has been Created")
)


})

const addMemberToHousehold =asyncHandler( async (req,res) => {
    const {email}=req.body;
    const {householdId}=req.params;
    const Householddoc = await Household.findById(householdId);
    if(!Householddoc){
        throw new ApiError(400,"there Is no Household With That Id ")
    }
    const findUser=await User.findOne({email})
    if(!findUser){
        throw new ApiError(400,"No user With that Email Exist in DataBase ")
    }

    const housememberexist = await HouseholdMember.findOne({user:findUser._id,household:householdId})
if (housememberexist){
    throw new ApiError(400,"User With The Email Exist in Household Already")
}
const newmember = await HouseholdMember.create({
    user:findUser._id,
    household:householdId,
    role:UserRolesEnum.MEMBER
})

res.status(201).json(
    new Apiresponse(201,{housholdmember:newmember},"Succefuly added The Member")
)
})
const getallMebersOfhousehold = asyncHandler( async (req,res) => {
    const {householdid}=req.params;
   const Householddoc = await Household.findById(householdid);
    if(!Householddoc){
        throw new ApiError(404,"there Is no Household With That Id ")
    } 
    const householdmember= await HouseholdMember.find({household:Householddoc._id}).populate({path:"user",select:"username email"})
res.status(200).json(
    new Apiresponse(200,householdmember,"Succesfully fetched data ")
)
})
const removememberfromhousehold= asyncHandler(async (req,res) => {
    const{householdId,userId}=req.params;
    const Householddoc = await Household.findById(householdId);
    if(!Householddoc){
        throw new ApiError(404,"there Is no Household With That Id ")
    }  
    const isMemberExist=await HouseholdMember.findOneAndDelete({household:Householddoc._id,user:userId})
    if(!isMemberExist){
        throw new ApiError(404,"there is no member with that id  in household  ")
    } 
res.status(200).json(
    new Apiresponse(200,{isMemberExist},"the user has been removed  from Household ")
)
    
})
const deletehouseholdt = asyncHandler(async (req, res) => { 
  const { householdId} = req.params;

  const household = await Household.findOneAndDelete({_id:householdId,createdBy:req.user._id});
  if (!household) {
    throw new ApiError(404, "Household not found");
  }
  await HouseholdMember.deleteMany({ household: householdId })

  return res
    .status(200)
    .json(new Apiresponse(200, household, "household deleted successfully"));
});
const getHouseHoldbyId = asyncHandler(async (req , res) => {
  const { householdId } = req.params;
 const Householddoc = await Household.findById(householdId);
    if(!Householddoc){
        throw new ApiError(404,"there Is no Household With That Id ")
    } 

  return res
    .status(200)
    .json(new Apiresponse(200,Householddoc , "houseHold fetched successfully"));
});
