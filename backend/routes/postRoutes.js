import express from 'express';
import { createPost, getPost, deletePost, likePost, replyPost, getFeedPosts } from '../controllers/postController.js';
import { userAuth } from '../middlewares/userAuthMiddleware.js';
import Post from '../models/postModel.js';

const router = express.Router();

router.get("/feed", userAuth, getFeedPosts);
router.get("/:id", getPost);
router.post("/create", userAuth, createPost);
router.delete("/:id", userAuth, deletePost);
router.post("/like/:id", userAuth, likePost);
router.post("/reply/:id", userAuth, replyPost);

export default router;