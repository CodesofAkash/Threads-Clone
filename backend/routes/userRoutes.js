import express from "express";
import { userAuth } from "../middlewares/userAuthMiddleware.js";
import { signupUser, getSuggestedUsers, loginUser, logoutUser, followUser, updateUser, getUser, freezeAccount } from "../controllers/userController.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/profile/:username", userAuth, getUser);
router.get("/suggested", userAuth, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);
router.get("/follow/:id", userAuth, followUser);
router.put("/update", userAuth, updateUser);
router.put("/freeze", userAuth, freezeAccount);

export default router;