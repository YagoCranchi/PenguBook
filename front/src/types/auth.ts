export interface AuthState {
    accessToken?: string;
    userInfo?: UserInfo;
}

export interface UserInfo {
    userId?: string;
    name?: string;
    email?: string;
    cpf?: string;
    phone?: string;
    creationDate?: string;
    roleName?: string;
}

export interface AuthContextType {
    auth: AuthState;
    setAuth: (accessToken: string, userInfo: UserInfo) => void;
}

export interface RequireAuthProps {
    allowedRole: string;
}
