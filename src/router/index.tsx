import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// 添加404页面（可选）
// import NotFound from "../pages/NotFound";  // 你可以自己创建这个页面，或使用默认的 "未找到页面"

const AppRouter = () => {
    return (
        <Routes>
            {/* 登录页，使用 AuthLayout 布局 */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* 受保护页面，使用 MainLayout 布局 */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>

            {/* 默认页面，根路径跳转到登录页或仪表板 */}
            {/*<Route path="/" element={<Dashboard />} /> /!* 默认跳转到 Dashboard *!/*/}

            {/* 404 页面：匹配所有未定义的路径 */}
            {/*<Route path="*" element={<NotFound />} /> /!* 或者可以展示自定义的 404 页面 *!/*/}
        </Routes>
    );
};

export default AppRouter;
