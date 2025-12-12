import { Router } from "express";
import { choreComplete, createchore, getAllChores } from "../controller/chore.controller.js";
import { verifyJWT } from "../middlleware/auth.middleware.js";
import { isHouseHoldMeber } from "../middlleware/RABC.middleware.js";

const router = Router();

router.route("/households/:householdId/chore").post(verifyJWT,isHouseHoldMeber,createchore)    
router.route("/households/:householdId/chores").get(verifyJWT,isHouseHoldMeber,getAllChores)    
router.route("/households/:householdId/:choreid").post(verifyJWT,isHouseHoldMeber,choreComplete)    




export default router;