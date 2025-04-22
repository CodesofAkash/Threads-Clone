import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import {v2 as cloudinary} from 'cloudinary'

export const createPost = async (req, res) => {
    const { text } = req.body;
    let { img } = req.body;
    if (!text && !img) {
        return res.status(400).json({
            success: false,
            error: 'Please provide text or image for the post',
        });
    }

    const maxLength = 500;
    if(text.length > maxLength) {
        return res.status(400).json({error: `Text must be less than ${maxLength} characters`})
    }

    if(img) {
        const uploadedResponse = await cloudinary.uploader.upload(img);
        img = uploadedResponse.secure_url;
    }

    const { id } = req.user;
    
    try {
        const post = await Post.create({
            text,
            img,
            postedBy: id,
        });
        if(!post) {
            return res.status(400).json({
                success: false,
                error: 'Failed to create post',
            });
        }

        await post.populate([
            { path: 'postedBy', select: 'name username profilePic' },
            { path: 'likes', select: 'name profilePic' },
            { path: 'replies.user', select: 'name username profilePic' }
        ]);

        res.status(201).json({
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(400).json({error: "Post not found"});
        }
        await post.populate([
            { path: 'postedBy', select: 'name username profilePic' },
        ]);

        res.status(200).json({post})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(400).json({error: "Post not found"});
        }

        if(post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: "Unauthorized"});
        }

        if(post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const likePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: "Post not found"});
        }

        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost) {
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked Successfully"});
        } else{
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: "Post liked Successfully"});
        }

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const replyPost = async (req, res) => {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;

    if(!postId || !message) {
        return res.status(404).json({error: "PostId or message not found"});
    }

    try {
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({error: "Post not found"});
        }
        
        const reply = {user: userId, text: message, username: req.user.username, profilePic: req.user.profilePic};
        post.replies.push(reply);
        await post.save();
        res.status(200).json(reply);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1});
        for (const post of feedPosts) {
            await post.populate([
                { path: 'postedBy', select: 'name username profilePic' },
                { path: 'likes', select: 'name profilePic' },
                { path: 'replies.user', select: 'name username profilePic' }
            ])
        }
        res.status(200).json({feedPosts});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}