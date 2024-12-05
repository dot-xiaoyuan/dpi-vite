import axios from 'axios';
import {message} from 'antd';
import {removeToken} from '../utils/storage';

export const baseURL = '/api'
// 创建 Axios 实例
const apiClient = axios.create({
    baseURL: baseURL, // 后端接口的基础路径
    timeout: 10000, // 超时时间
    withCredentials: true,
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 返回成功的响应数据
        return response.data;
    },
    (error) => {
        console.log(error)
        if (error.response) {
            // 处理常见的 HTTP 错误
            const {status, data} = error.response;
            if (status === 401) {
                message.error('登录已过期，请重新登录！');
                removeToken(); // 清除本地 Token
                window.location.href = '/login'; // 跳转到登录页面
            } else {
                message.error(data.message || '请求失败，请稍后再试！');
            }
        } else {
            message.error('网络错误，请检查您的网络连接！');
        }
        return Promise.reject(error);
    }
);


export default apiClient;
