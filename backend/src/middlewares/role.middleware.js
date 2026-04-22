import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("USER ROLE:", req.user.role);
    console.log("REQUIRED ROLES:", roles);
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }
    next();
  };
};
