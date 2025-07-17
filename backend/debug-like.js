// Debug script to test like functionality
// Run this in the backend root directory with: node debug-like.js

import mongoose from 'mongoose';
import Post from './models/postModel.js';
import User from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const testLikeFunctionality = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a test post
        const post = await Post.findOne().populate('likes');
        if (!post) {
            console.log('No posts found');
            return;
        }

        console.log('Post ID:', post._id);
        console.log('Initial likes:', post.likes);
        console.log('Likes count:', post.likes.length);

        // Find a test user
        const user = await User.findOne();
        if (!user) {
            console.log('No users found');
            return;
        }

        console.log('User ID:', user._id);
        console.log('User likes this post:', post.likes.includes(user._id));

        // Test the like logic
        const userLikedPost = post.likes.includes(user._id);
        console.log('User already liked:', userLikedPost);

        if (userLikedPost) {
            console.log('Removing like...');
            await Post.updateOne({_id: post._id}, {$pull: {likes: user._id}});
        } else {
            console.log('Adding like...');
            post.likes.push(user._id);
            await post.save();
        }

        // Check the result
        const updatedPost = await Post.findById(post._id).populate('likes');
        console.log('Updated likes:', updatedPost.likes);
        console.log('Updated likes count:', updatedPost.likes.length);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
};

testLikeFunctionality();
