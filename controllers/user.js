import { asyncError } from "../middlewares/errorMiddleware.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import passport from "passport";
import jwt from "jsonwebtoken";

export const myProfile = (req, res, next) => {
  console.log("my profile");
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// export const logout = (req, res, next) => {
//   console.log(req);
//   req.session.destroy((err) => {
//     if (err) return next(err);
//     res.clearCookie("connect.sid", {
//       secure: process.env.NODE_ENV === "development" ? false : true,
//       httpOnly: process.env.NODE_ENV === "development" ? false : true,
//       sameSite: process.env.NODE_ENV === "development" ? false : "none",
//     });
//     res.status(200).json({
//       message: "Logged Out",
//     });
//   });
// };

export const logout = (req, res) => {
  // In a JWT-based authentication system, logging out is done on the client side by removing the token
  // You can choose to implement this logic on the client side, such as clearing the token from local storage or cookies
  // The server doesn't need to do anything specific for logout
  res.status(200).json({
    message: "Logged Out",
  });
};

export const getAdminUsers = asyncError(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    users,
  });
});

export const getAdminStats = asyncError(async (req, res, next) => {
  const usersCount = await User.countDocuments();

  const orders = await Order.find({});

  const preparingOrders = orders.filter((i) => i.orderStatus === "Preparing");
  const shippedOrders = orders.filter((i) => i.orderStatus === "Shipped");
  const deliveredOrders = orders.filter((i) => i.orderStatus === "Delivered");

  let totalIncome = 0;

  orders.forEach((i) => {
    totalIncome += i.totalAmount;
  });

  res.status(200).json({
    success: true,
    usersCount,
    ordersCount: {
      total: orders.length,
      preparing: preparingOrders.length,
      shipped: shippedOrders.length,
      delivered: deliveredOrders.length,
    },
    totalIncome,
  });
});

// // // Controller for handling user login
// export const loginUser = (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) {
//       return next(err);
//     }

//     if (!user) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }

//     // If authentication succeeded, log in the user and redirect to /me
//     req.logIn(user, (loginErr) => {
//       if (loginErr) {
//         return next(loginErr);
//       }

//       // Redirect to /me upon successful login
//       return res.redirect("/me");
//     });
//   })(req, res, next);
// };

export const signUp = async (req, res, next) => {
  try {
    // Extract user data from the request body
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = new User({ name, email, password });

    await newUser.save();

    // Create a JWT token for the newly registered user
    const secretKey = "mbaburgerwali";

    // Only include the userId in the payload
    const payload = {
      userId: newUser._id,
      role: newUser.role,
      // Include any other relevant user data here
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "100000" });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully", token });
  } catch (error) {
    next(error);
  }
};
