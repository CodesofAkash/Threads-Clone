import express from "express";
import { userAuth } from "../middlewares/userAuthMiddleware.js";
import { signupUser, loginUser, logoutUser, followUser, updateUser, getUser } from "../controllers/userController.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/profile/:username", getUser);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", userAuth, logoutUser);
router.get("/follow/:id", userAuth, followUser);
router.put("/update", userAuth, updateUser);

router.get("/follow-status/:userId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const targetUserId = req.params.userId;

        if (!targetUserId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const currentUser = await User.findById(loggedInUserId);

        const isFollowing = currentUser.following.includes(targetUserId);

        res.json({ followed: isFollowing });
    } catch (err) {
        console.error("Error checking follow status:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;