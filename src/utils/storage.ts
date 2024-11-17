const TOKEN_KEY = 'app_token';

// 获取 Token
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// 设置 Token
export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// 移除 Token
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
