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
import DynamicIframe from "../components/iframes/DynamicIframe.tsx";

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

                <Route path="/setting/sms" element={<DynamicIframe redirectUrl="/setting/sms/index"/>}/>
                <Route path="/statics/activity" element={<DynamicIframe redirectUrl="/report/operate/activity"/>}/>
                <Route path="/statics/terminal" element={<DynamicIframe redirectUrl="/report/online/terminal"/>}/>
                <Route path="/strategy/control/index" element={<DynamicIframe redirectUrl="/strategy/control/index"/>}/>
                <Route path="/network/default" element={<DynamicIframe redirectUrl="/network/default/index"/>}/>
                <Route path="/log/detail" element={<DynamicIframe redirectUrl="/log/detail/index"/>}/>
                <Route path="/auth/assign/index" element={<DynamicIframe redirectUrl="/auth/assign/index"/>}/>
                <Route path="/report/dashboard/index" element={<DynamicIframe redirectUrl="/report/dashboard/index"/>}/>
                <Route path="/message/message/index" element={<DynamicIframe redirectUrl="/message/message/index"/>}/>
                <Route path="/setting/email/index" element={<DynamicIframe redirectUrl="/setting/email/index"/>}/>
                <Route path="/message/mesgploy/index" element={<DynamicIframe redirectUrl="/message/mesgploy/index"/>}/>
                <Route path="/interface/binding/index" element={<DynamicIframe redirectUrl="/interfaces/binding/index"/>}/>
                <Route path="/interface/default/index" element={<DynamicIframe redirectUrl="/interfaces/default/index"/>}/>
                <Route path="/user/manager/safe" element={<DynamicIframe redirectUrl="/user/manager/safe"/>}/>
                <Route path="/setting/dictionary/index" element={<DynamicIframe redirectUrl="/setting/dictionary/index"/>}/>
                <Route path="/strategy/zone-set/index" element={<DynamicIframe redirectUrl="/strategy/zone-set/index"/>}/>
                <Route path="/log/system/index" element={<DynamicIframe redirectUrl="/log/system/index"/>}/>
                <Route path="/log/operate/index" element={<DynamicIframe redirectUrl="/log/operate/index"/>}/>
                <Route path="/message/sendmsg/index" element={<DynamicIframe redirectUrl="/message/sendmsg/index"/>}/>
                <Route path="/message/sendmsg/index" element={<DynamicIframe redirectUrl="/message/sendmsg/index"/>}/>
                <Route path="/log/login/list" element={<DynamicIframe redirectUrl="/log/login/list"/>}/>
                <Route path="/report/monitor/index" element={<DynamicIframe redirectUrl="/report/monitor/index"/>}/>
                <Route path="/user/online/index" element={<DynamicIframe redirectUrl="/user/online/index"/>}/>
            </Route>

            {/* 默认页面，根路径跳转到登录页或仪表板 */}
            {/*<Route path="/" element={<Dashboard />} /> /!* 默认跳转到 Dashboard *!/*/}

            {/* 404 页面：匹配所有未定义的路径 */}
            {/*<Route path="*" element={<NotFound />} /> /!* 或者可以展示自定义的 404 页面 *!/*/}
        </Routes>
    );
};

export default AppRouter;
