import {Navigate, Route, Routes} from 'react-router-dom';
import LoginPage from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import Identification from "../pages/Terminal/Identification";
import Useragent from "../pages/Terminal/Useragent";
import Application from "../pages/Terminal/Application";
import IPDetail from "../pages/IPDetail";
import RealTimeShared from "../pages/Judge/RealTimeShared";
import PolicyManagement from "../pages/Policy/Access";
import SuspectedShared from "../pages/Judge/SuspectedShared";
import UserEvents from "../pages/Log/Users";
import ConfigForm from "../pages/Setting/Config";
import ChangePassword from "../pages/Setting/ChangePassword";
import Authorization from "../pages/Setting/Authorization";
import FeatureLibrary from "../pages/Judge/FeatureLibrary";
import ProxyRecord from "../pages/Log/Proxy";
import PrinterMacList from "../pages/Terminal/Printer";
import Operator from "../pages/Setting/Operator";
import Interfaces from "../pages/Setting/Interfaces";

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
                <Route path="/terminal/printer" element={<PrinterMacList/>}/>
                <Route path="/terminal/identification" element={<Identification/>}/>
                <Route path="/terminal/useragent" element={<Useragent/>}/>
                <Route path="/terminal/application" element={<Application/>}/>
                <Route path="/terminal/ip-detail" element={<IPDetail/>}/>
                <Route path="/feature-judgment/real-time-shared" element={<RealTimeShared/>}/>
                <Route path="/feature-judgment/suspected-shared" element={<SuspectedShared/>}/>
                <Route path="/feature-judgment/feature-library" element={<FeatureLibrary/>}/>
                <Route path="/log/users" element={<UserEvents/>}/>
                <Route path="/log/proxy" element={<ProxyRecord/>}/>
                <Route path="/policy/access" element={<PolicyManagement/>}/>
                <Route path="/setting/config" element={<ConfigForm/>}/>
                <Route path="/setting/change-password" element={<ChangePassword/>}/>
                <Route path="/setting/authorization" element={<Authorization/>}/>
                <Route path="/setting/sms" element={<Operator/>}/>
                <Route path="/setting/interfaces" element={<Interfaces/>}/>
            </Route>

            {/* 默认页面，根路径跳转到登录页或仪表板 */}
            {/*<Route path="/" element={<Dashboard />} /> /!* 默认跳转到 Dashboard *!/*/}

            {/* 404 页面：匹配所有未定义的路径 */}
            {/*<Route path="*" element={<NotFound />} /> /!* 或者可以展示自定义的 404 页面 *!/*/}
        </Routes>
    );
};

export default AppRouter;
