import { Router } from "express";
import { addMemberToHousehold, createHousehold, deletehouseholdt, getallMebersOfhousehold, getHouseHoldbyId, removememberfromhousehold } from "../controller/household.controller.js";
import { verifyJWT } from "../middlleware/auth.middleware.js";
import { isHouseHoldMeber, requireHouseholdOwner } from "../middlleware/RABC.middleware.js";
import { addmemberValidator, createHousholdvalidator } from "../validators/validator.housholder.js";
import { validate } from "../middlleware/validator.middleware.js";
const router = Router()

router.route("/createHoushold").post(verifyJWT,createHousholdvalidator(),validate,createHousehold);
router.route("/member/:householdId").post(verifyJWT,requireHouseholdOwner,addmemberValidator(),validate,addMemberToHousehold);
router.route("/members/:householdId").get(verifyJWT,isHouseHoldMeber,getallMebersOfhousehold);

router.route("/households/:householdId/members/:userId").post(verifyJWT,requireHouseholdOwner,removememberfromhousehold);
router.route("/delete/:householdId").post(requireHouseholdOwner,deletehouseholdt);
router.route("/household/:householdId").get(verifyJWT,isHouseHoldMeber,getHouseHoldbyId);


export default router;