import mongoose from "mongoose";
import { HouseholdMember } from "../models/household.member.model.js";
import { Household } from "../models/household.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const requireHouseholdOwner =  asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, {}, "Authentication required");
    }
    const householdId = req.params.householdId;
    if (!householdId) {
      throw new ApiError(400, {}, "Missing householdId param");
    }
    if (!mongoose.Types.ObjectId.isValid(householdId)) {
      throw new ApiError(400, {}, "Invalid householdId format");
    }
    const household = await Household.findById(householdId).select("createdBy");
    if (!household) {
      throw new ApiError(404, {}, "Household not found");
    }
    const ownerId = household.createdBy && household.createdBy.toString();
    const userId = req.user._id.toString();

    if (ownerId !== userId) {
      throw new ApiError(403, {}, "Forbidden: owner required");
    }
    next();
  });

const isHouseHoldMeber= asyncHandler( async (req,res,next) => {
    if (!req.user || !req.user._id) {
      throw new ApiError(401, {}, "Authentication required");
    }
    const householdId = req.params.householdId;
    if (!householdId) {
      throw new ApiError(400, {}, "Missing householdId param");
    }
    if (!mongoose.Types.ObjectId.isValid(householdId)) {
      throw new ApiError(400, {}, "Invalid householdId format");
    }
    const membership = await HouseholdMember.findOne({
      household: householdId,
      user: req.user._id,
    }).select("user");
    if (!membership) {
      throw new ApiError(403, {}, "Forbidden: user is not a member of this household");
    }
    next()
})
export { requireHouseholdOwner,isHouseHoldMeber};