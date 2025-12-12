import {body} from "express-validator"
import { AvailableFrequency } from "../utils/constants.js";

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