import {useRecoilState} from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useState } from "react"
import useShowToast from './useShowToast.js';

const useFollow = (user) => {

    const [currentUser, setCurrentUser] = useRecoilState(userAtom);
    const [followed, setFollowed] = useState(
        user?.isFollowing !== undefined 
            ? user.isFollowing 
            : user?.followers.includes(currentUser?._id)
    );
    const [updating, setUpdating] = useState(false);

    const showToast = useShowToast()

    const followUser = async () => {
        if(!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        if(updating) return;
        setUpdating(true);
        
        try {
            const res = await fetch(`/api/users/follow/${user?._id}`);
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            // Update the user data with backend response
            if(data.userToFollow) {
                user.followers = data.userToFollow.followers;
            }
            
            // Update current user state with backend response
            if(data.currentUser) {
                setCurrentUser(data.currentUser);
            }
            
            // Update local state
            setFollowed(data.isFollowing);
            
            showToast("Success", data.message, "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }    
    };

  return {followUser, updating, followed}
}

export default useFollow
