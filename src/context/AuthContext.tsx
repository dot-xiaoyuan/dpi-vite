import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '../services/authService';
import {useNavigate} from 'react-router-dom';

interface AuthContextType {
    user: any;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const userData = await getCurrentUser();
                    // navigate('/') // 重定向至首页
                    setUser(userData);
                } catch (error) {
                    console.error('Token 无效或已过期');
                    localStorage.removeItem('auth_token'); // 清除无效 token
                    setUser(null);
                    navigate('/login') // 跳转到登录页面
                }
            } else {
                navigate('/login') // 跳转到登录页面
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('auth_token'); // 清除 token
        setUser(null);
        navigate('/login') ; // 跳转到登录页面
    };

    const refreshUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('刷新用户信息失败');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth 必须在 AuthProvider 内使用');
    }
    return context;
};
