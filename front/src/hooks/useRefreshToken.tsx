import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth, auth } = useAuth();

    const refreshToken = async () => {
        try {
            const response = await axios.get('/refresh', {
                withCredentials: true,
            });
            var userInfos = await getUserInfos(response.data.accessToken);
            await setAuth(response.data.accessToken, userInfos);
            return response.data.accessToken;
        } catch (error) {
            console.error('Erro ao atualizar o token:', error);
            throw error;
        }
    };

    return refreshToken;
};

async function getUserInfos(accessToken: string) {
    if (!accessToken) return console.log('No access token provided');

    try {
        const response = await axios.get('/user', {
            withCredentials: true,
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    } catch (err: any) {
    }
}

export default useRefreshToken;