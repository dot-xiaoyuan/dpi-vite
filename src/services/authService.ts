import apiClient, {baseURL} from './api';
import SHA256 from 'crypto-js/sha256';
import axios from "axios";

// 登录接口
export const login = async (username: string, password: string) => {
    let pwd = SHA256(password).toString();
    return await axios.post(baseURL + '/auth/login', {
        username: username,
        password: pwd,
    });
};

// 获取当前用户信息
export const getCurrentUser = async () => {
    return await apiClient.get('/me');
};

// 退出登录
export const logout = async () => {
    return await apiClient.post('/auth/logout');
};

export const dashboard = async () => {
    return await apiClient.get('/dashboard');
}