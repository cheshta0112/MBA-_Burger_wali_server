import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return next(new ErrorHandler("Not Logged In", 401));
};

export const authorizeAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user;

    if (user.role === "admin") {
      return next();
    }
  }

  return next(new ErrorHandler("Only Admin Allowed", 403));
};
