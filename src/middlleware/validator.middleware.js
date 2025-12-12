import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extracted = errors.array().map(err => ({
    param: err.param,
    msg: err.msg,
    value: err.value,
    location: err.location
  }));

  throw new ApiError(422, { errors: extracted }, "Received data is not valid")
};

