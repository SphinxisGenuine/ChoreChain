import { Router } from "express";
import { choreComplete, createchore, getAllChores } from "../controller/chore.controller.js";
import { verifyJWT } from "../middlleware/auth.middleware.js";
import { isHouseHoldMeber } from "../middlleware/RABC.middleware.js";
import {createChoreValidator} from "../validators/chore.validator.js";
import { validate } from "../middlleware/validator.middleware.js";

const router = Router();

router.route("/households/:householdId/chore").post(verifyJWT,isHouseHoldMeber,createChoreValidator (),validate,createchore)    
router.route("/households/:householdId/chores").get(verifyJWT,isHouseHoldMeber,getAllChores)    
router.route("/households/:householdId/:choreid").post(verifyJWT,isHouseHoldMeber,choreComplete)    

//,createchorevalidator(),validate,



export default router;