import { useSetRecoilState } from 'recoil';
import useShowToast from './useShowToast'
import userAtom from '../atoms/userAtom';

const useLogout = () => {
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);

    const logout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            
            localStorage.removeItem("user-threads");
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    return logout;
}

export default useLogout
