import React from 'react';
import {ProLayout} from '@ant-design/pro-components';
import {Outlet, useNavigate} from 'react-router-dom';
import {Dropdown, Menu} from 'antd';
import {
    BarChartOutlined,
    DashboardOutlined,
    DeploymentUnitOutlined,
    LogoutOutlined,
    CrownFilled,
    PaperClipOutlined,
    SettingOutlined,
    BarsOutlined,
    PushpinOutlined
} from '@ant-design/icons';
import {useAuth} from '../context/AuthContext';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const {logout, user} = useAuth(); // 从 AuthContext 获取用户信息

    const handleLogout = async () => {
        await logout(); // 处理登出逻辑
        navigate('/login'); // 跳转到登录页
    };

    const menuItems = [
        {
            path: '/dashboard',
            name: '仪表盘',
            icon: <DashboardOutlined/>,
        },
        {
            path: '/terminal-identification',
            name: '终端识别',
            icon: <DeploymentUnitOutlined/>,
            routes: [
                {
                    path: '/terminal/identification',
                    name: '终端类型识别',
                    icon: <PushpinOutlined />,
                },
                {
                    path: '/terminal/useragent',
                    name: 'UA特征识别',
                    icon: <CrownFilled />,
                },
                {
                    path: '/terminal/application',
                    name: '应用识别',
                    icon: <CrownFilled />,
                },
            ],
        },
        {
            path: '/feature-determination',
            name: '特征判定',
            icon: <PaperClipOutlined />,
            routes: [
                {
                    path: '/judge/realtime',
                    name: '实时共享终端判定',
                    icon: <CrownFilled />,
                },
                {
                    path: '/judge/doubt',
                    name: '疑似共享终端判定',
                    icon: <CrownFilled />,
                },
            ],
        },
        {
            path: '/policy-configuration',
            name: '策略配置',
            icon: <SettingOutlined />,
            routes: [
                {
                    path: '/policy/access',
                    name: '准入策略',
                },
                {
                    path: '/admin/sub-page2',
                    name: '控制策略',
                    icon: <CrownFilled />,
                    component: './Welcome',
                },
            ],
        },
        {
            path: '/log-management',
            name: '日志管理',
            icon: <BarsOutlined />,
            routes: [
                {
                    path: '/admin/sub-page1',
                    name: '用户上下线日志',
                    icon: 'https://gw.alipayobjects.com/zos/antfincdn/upvrAjAPQX/Logo_Tech%252520UI.svg',
                    component: './Welcome',
                },
                {
                    path: '/admin/sub-page2',
                    name: '控制策略',
                    icon: <CrownFilled />,
                    component: './Welcome',
                },
            ],
        }
    ];

    const userMenu = (
        <Menu
            items={[
                {
                    key: 'logout',
                    icon: <LogoutOutlined/>,
                    label: 'Logout',
                    onClick: handleLogout,
                },
            ]}
        />
    );

    return (
        <ProLayout
            siderWidth={256}
            layout="mix"
            title="DPI Analyze"
            logo={<BarChartOutlined />}
            route={{
                path: '/',
                routes: menuItems,
            }}
            menu={{
                request: async () => menuItems,
            }}
            onMenuHeaderClick={() => navigate('/dashboard')}
            menuItemRender={(item, dom) => (
                <div onClick={() => navigate(item.path || '/')}>{dom}</div>
            )}
            contentWidth="Fluid"
            contentStyle={{
                margin: 0,
                padding: 16,
            }}
            actionsRender={() => [
                <Dropdown overlay={userMenu}>
                    <span style={{ cursor: 'pointer' }}>
                        {user?.username || 'Guest'}
                    </span>
                </Dropdown>,
            ]}
        >
            <Outlet />
        </ProLayout>
    );
};

export default MainLayout;
