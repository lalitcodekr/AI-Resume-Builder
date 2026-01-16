import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getAdminDashboardStats,
  getAnalyticsStats,
} from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/", isAuth, getAllUsers);
userRouter.put("/:id", isAuth, updateUser);
userRouter.delete("/:id", isAuth, deleteUser);
userRouter.get("/dashboard-stat", getAdminDashboardStats);
userRouter.get("/analytics-stat", getAnalyticsStats);

export default userRouter;
