import mongoose, { Schema } from "mongoose";
import { AvailableUserRole,UserRolesEnum } from "../utils/constants";

const householdMemberSchema = new Schema ({
     user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    household: {
      type: Schema.Types.ObjectId,
      ref: "Household",
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRole,
      default: UserRolesEnum.MEMBER,
    },
 
},{timestamps:true});

export const HouseholdMember=mongoose.model("HouseholdMember",householdMemberSchema);