import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogoff = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.post('/logoff', {
                withCredentials: true,
            });

            setAuth("", {});
            navigate('/', { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogoff;