import { useSetRecoilState } from 'recoil';
import useShowToast from './useShowToast'
import userAtom from '../atoms/userAtom';
import { API_BASE_URL } from '../config/api';
import tokenManager from '../utils/tokenManager';

const useLogout = () => {
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);

    const logout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/logout`, {
                method: "POST",
                headers: tokenManager.getAuthHeaders(),
                credentials: "include",
            });
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            
            // Clear token and user data
            tokenManager.removeToken();
            localStorage.removeItem("user-threads");
            setUser(null);
            showToast("Success", "Logged out successfully!", "success");
        } catch (error) {
            console.log(error);
            // Even if API call fails, clear local data
            tokenManager.removeToken();
            localStorage.removeItem("user-threads");
            setUser(null);
        }
    }

    return logout;
}

export default useLogout
