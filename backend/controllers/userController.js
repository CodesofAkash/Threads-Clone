import User from "../models/userModel.js"
import Post from "../models/postModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary} from 'cloudinary'

const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Please provide username" });
    }

    const user = await User.findOne({username}).select("-password -__v -createdAt -updatedAt");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followerUsers = await User.find({
      _id: { $in: user.followers },
    }).select("name profilePic");
    
    const followingUsers = await User.find({
      _id: { $in: user.following },
    }).select("name profilePic");
    
    const userObj = user.toObject();
    userObj.followers = followerUsers;
    userObj.following = followingUsers;

    // Check if the current user is following this profile user
    let isFollowing = false;
    if (req.user && req.user._id) {
      const currentUser = await User.findById(req.user._id);
      if (currentUser) {
        isFollowing = currentUser.following.some(followingId => 
          followingId.toString() === user._id.toString()
        );
      }
    }
    userObj.isFollowing = isFollowing;

    const userPosts = await Post.find({postedBy: user._id}).sort({ createdAt: -1 });
    for (const post of userPosts) {
      await post.populate([
          { path: 'postedBy', select: 'name username profilePic' },
          { path: 'likes', select: 'name profilePic' },
          { path: 'replies.user', select: 'name username profilePic' }
      ])
    }

    return res.status(200).json({user : {user: userObj, userPosts}});
  } catch (error) {
    console.error("Error during get user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
        _id: {$ne : userId},
        }
      }, {
        $sample: {size: 10}
      }
    ]);

    const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0,5);
    suggestedUsers.forEach(user => user.password = null);
    return res.status(200).json(suggestedUsers);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
}

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if(!name || !email || !username || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const user = await User.findOne({ $or: [ {email}, {username} ] });
    if(user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword
    })

    if (newUser) {
      const token = generateTokenAndSetCookie(newUser._id, res);
      newUser.password = null;
      return res.status(201).json({newUser});
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }

  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(user._id, res);

    if(user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }
  
    user.password = null;
    return res.status(200).json({user});
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, secure: true });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Please provide a id" });
    }

    const userToFollow = await User.findById(id);
    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    if( id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    if (currentUser.following.includes(id)) {
      // Unfollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      
      // Get updated user data
      const updatedUserToFollow = await User.findById(id).select("-password -__v -createdAt -updatedAt");
      const updatedCurrentUser = await User.findById(req.user._id).select("-password -__v -createdAt -updatedAt");
      
      return res.status(200).json({ 
        message: "Unfollowed user successfully",
        isFollowing: false,
        userToFollow: updatedUserToFollow,
        currentUser: updatedCurrentUser
      });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      
      // Get updated user data
      const updatedUserToFollow = await User.findById(id).select("-password -__v -createdAt -updatedAt");
      const updatedCurrentUser = await User.findById(req.user._id).select("-password -__v -createdAt -updatedAt");
      
      return res.status(200).json({ 
        message: "Followed user successfully",
        isFollowing: true,
        userToFollow: updatedUserToFollow,
        currentUser: updatedCurrentUser
      });
    }
  } catch (error) {
    console.error("Error during follow:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateUser = async (req, res) => {
  try {
    const { name, email, username, password, bio, profilePic } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    name && (user.name = name);
    email && (user.email = email);
    username && (user.username = username);
    bio && (user.bio = bio);

    if(profilePic) {
      if(user.profilePic) {
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      user.profilePic = uploadedResponse.secure_url;
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    await Post.updateMany(
      {"replies.user": userId},
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        }
      },
      {arrayFilters: [{"reply.user": userId}]}
    )

    user.password = null;
    return res.status(200).json({user});
  } catch (error) {
    console.error("Error during user update:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(404).json({ error: "User not found" });

    user.isFrozen = true;
    await user.save();

    return res.status(200).json({ success : true });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { getUser, getSuggestedUsers, signupUser, loginUser, logoutUser, followUser, updateUser, freezeAccount };