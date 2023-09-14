import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = (req, res, next) => {
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Not Logged In", 401));
  }

  const token = tokenHeader.split(" ")[1]; // Extract the token part

  try {
    const secretKey = "mbaburgerwali"; // Replace with your secret key
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;

    return next();
  } catch (error) {
    return next(new ErrorHandler("Invalid Token", 401));
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Not Logged In", 401));
  }

  if (req.user.role === "admin") {
    return next();
  }

  return next(new ErrorHandler("Only Admin Allowed", 403));
};
