import {useRecoilState} from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useState, useEffect } from "react"
import useShowToast from './useShowToast.js';
import apiRequest from '../utils/apiRequest.js';

const useFollow = (user) => {

    const [currentUser, setCurrentUser] = useRecoilState(userAtom);
    const [followed, setFollowed] = useState(false);
    const [updating, setUpdating] = useState(false);

    const showToast = useShowToast()

    // Initialize followed state based on current user's following list or user's isFollowing field
    useEffect(() => {
        if (currentUser && user) {
            // Check if user object has isFollowing field (from backend)
            if (Object.prototype.hasOwnProperty.call(user, 'isFollowing')) {
                setFollowed(user.isFollowing);
            } else {
                // Fallback: check if current user is following this user
                const isFollowing = currentUser.following?.includes(user._id) || false;
                setFollowed(isFollowing);
            }
        } else {
            setFollowed(false);
        }
    }, [currentUser, user, user?.isFollowing]); // Add user?.isFollowing as dependency

    const followUser = async () => {
        if(!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        if(updating) return;
        setUpdating(true);
        try {
            const res = await apiRequest(`/api/users/follow/${user?._id}`, {
                method: "POST",
            });
            
            if (!res) return; // Handle unauthorized
            
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            // Update local state
            setFollowed(data.isFollowing);
            
            // Update current user's following list
            if (data.currentUser) {
                setCurrentUser(data.currentUser);
                localStorage.setItem("user-threads", JSON.stringify(data.currentUser));
            }

            // Update the user object if it exists
            if (user && data.userToFollow) {
                user.followers = data.userToFollow.followers;
                user.isFollowing = data.isFollowing;
            }

            showToast("Success", data.message, "success");
            
            // Return the follow status for parent components to handle
            return { isFollowing: data.isFollowing, userId: user._id };
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }    
    };

  return {followUser, updating, followed}
}

export default useFollow
