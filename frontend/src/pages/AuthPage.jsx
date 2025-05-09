import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";

import authScreenAtom from "../atoms/authAtom.js";
import { useRecoilValue } from "recoil";

const AuthPage = () => {

    const authScreenState = useRecoilValue(authScreenAtom);

    return (
        <>
            {authScreenState === 'login' ? <LoginCard /> : <SignupCard />}
        </>
    )
    
}

export default AuthPage
