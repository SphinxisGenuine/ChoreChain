// // body("dueDate")
//   .optional()
//   .isISO8601()
//   .withMessage("dueDate must be valid ISO-8601 date (YYYY-MM-DD or full ISO timestamp)");

import {body} from "express-validator"
import { AvailableFrequency } from "../utils/constants.js";

// const createchorevalidator = ()=>{
//     return [
    
//     body("name")
//       .trim()
//       .notEmpty()
//       .withMessage("name is required")
//       .isLowercase()
//       .withMessage("Task name must be in lower case")
//       .isLength({ min: 3 })
//       .withMessage("name of TaskHold must be at least 3 characters long"),
    
    
//       body("description")
//     .trim()
//     .optional(),
    
//     body("dueDate")
//     .notEmpty()
//     .withMessage("Date Is required")
//     .isISO8601()
//     .withMessage("dueDate must be valid ISO-8601 date (YYYY-MM-DD or full ISO timestamp)"),
    
    
//     body("frequency")
//     .trim()
//     .notEmpty()
//     .withMessage("Freqency Of task Is Required")
//     ]
// };

// export default createchorevalidator

export const createChoreValidator = () => {
  return [
    body("name")
      .trim()
        .notEmpty().withMessage("name is required")
        .isLength({ min: 3 }).withMessage("name must be at least 3 characters long"),

        body("description")
        .optional()
        .trim(),

        body("dueDate")
        .notEmpty().withMessage("Date is required")
        .isISO8601().withMessage("dueDate must be a valid ISO-8601 date"),
        
        body("frequency")
        .trim()
        .notEmpty()
        .withMessage("Frequency is required")
        .isIn(AvailableFrequency)
        .withMessage("Invalid frequency")
    ];
    };