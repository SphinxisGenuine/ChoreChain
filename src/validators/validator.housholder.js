import { body } from "express-validator"

const createHousholdvalidator= ()=>{
    return [
        body("name")
        .trim()
      .notEmpty()
      .withMessage("name is required")
      .isLowercase()
      .withMessage("Household name must be in lower case")
      .isLength({ min: 3 })
      .withMessage("name of HouseHold must be at least 3 characters long"),
    ]
}
const addmemberValidator=()=>{
    return [
        body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    ]
}
export{
    addmemberValidator,
    createHousholdvalidator
}