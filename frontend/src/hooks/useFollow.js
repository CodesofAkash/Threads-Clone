import {useRecoilState} from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useState } from "react"
import useShowToast from './useShowToast.js';

const useFollow = (user) => {

    const [currentUser, setCurrentUser] = useRecoilState(userAtom);
    const [followed, setFollowed] = useState(user?.followers.includes(currentUser?._id));
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

            if(followed) {
                showToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            } else {
                showToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser?._id);
            }

            setFollowed(!followed);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }    
    };

  return {followUser, updating, followed}
}

export default useFollow
