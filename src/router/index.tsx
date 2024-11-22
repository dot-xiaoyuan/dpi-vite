import {Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Identification from "../pages/Terminal/Identification";
import Useragent from "../pages/Terminal/Useragent";
import Application from "../pages/Terminal/Application";
import IPDetail from "../pages/IPDetail";
import Realtime from "../pages/Judge/Realtime";
import PolicyManagement from "../pages/Policy/Access";
import Suspected from "../pages/Judge/Suspected";
import UserEvents from "../pages/Log/Users";
import ConfigForm from "../pages/Setting/Config";
import ChangePassword from "../pages/Setting/ChangePassword";

// 添加404页面（可选）
// import NotFound from "../pages/NotFound";  // 你可以自己创建这个页面，或使用默认的 "未找到页面"

const AppRouter = () => {
    return (
        <Routes>
            {/* 登录页，使用 AuthLayout 布局 */}
            <Route element={<AuthLayout/>}>
                <Route path="/login" element={<LoginPage/>}/>
            </Route>

            {/* 受保护页面，使用 MainLayout 布局 */}
            <Route element={<MainLayout/>}>
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/terminal/identification" element={<Identification/>}/>
                <Route path="/terminal/useragent" element={<Useragent/>}/>
                <Route path="/terminal/application" element={<Application/>}/>
                <Route path="/terminal/ip-detail" element={<IPDetail/>}/>
                <Route path="/judge/realtime" element={<Realtime/>}/>
                <Route path="/judge/doubt" element={<Suspected/>}/>
                <Route path="/log/users" element={<UserEvents/>}/>
                <Route path="/policy/access" element={<PolicyManagement/>}/>
                <Route path="/setting/config" element={<ConfigForm/>}/>
                <Route path="/setting/change-password" element={<ChangePassword/>}/>
            </Route>

            {/* 默认页面，根路径跳转到登录页或仪表板 */}
            {/*<Route path="/" element={<Dashboard />} /> /!* 默认跳转到 Dashboard *!/*/}

            {/* 404 页面：匹配所有未定义的路径 */}
            {/*<Route path="*" element={<NotFound />} /> /!* 或者可以展示自定义的 404 页面 *!/*/}
        </Routes>
    );
};

export default AppRouter;
