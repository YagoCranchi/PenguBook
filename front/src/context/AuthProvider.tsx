import { createContext, useState, ReactNode } from "react";
import { AuthContextType, AuthState, UserInfo } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [auth, setAuthState] = useState<AuthState>({
        accessToken: undefined,
        userInfo: undefined,
    });

    const setAuth = (accessToken: string | undefined, userInfo: UserInfo | undefined) => {
        setAuthState({ accessToken, userInfo });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;