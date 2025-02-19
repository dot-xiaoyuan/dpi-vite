import React from 'react';
import {ProLayout} from '@ant-design/pro-components';
import {Outlet, useNavigate} from 'react-router-dom';
import {Dropdown, Menu} from 'antd';
import {
    DashboardOutlined,
    DeploymentUnitOutlined,
    LogoutOutlined,
    CrownFilled,
    PaperClipOutlined,
    SettingOutlined,
    BarsOutlined,
    PushpinOutlined, PrinterOutlined
} from '@ant-design/icons';
import {useAuth} from '../context/AuthContext';
import logo        from '../assets/srun.svg';

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
                    path: '/terminal/active',
                    name: '活跃设备观测',
                    icon: <PushpinOutlined />,
                },
                {
                    path: '/terminal',
                    name: '终端类型识别',
                    icon: <PushpinOutlined />,
                    routes: [
                        {
                            path: '/terminal/identification',
                            name: '全部设备',
                            icon: <PrinterOutlined />,
                        },
                        {
                            path: '/terminal/printer',
                            name: '打印机',
                            icon: <PrinterOutlined />,
                        }
                    ],
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
            path: '/feature-judgment',
            name: '特征判定',
            icon: <PaperClipOutlined />,
            routes: [
                {
                    path: '/feature-judgment/real-time-shared',
                    name: '实时共享终端判定',
                },
                {
                    path: '/feature-judgment/suspected-shared',
                    name: '疑似共享终端判定',
                },
                {
                    path: '/feature-judgment/feature-library',
                    name: '特征库更新',
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
                // {
                //     path: '/admin/sub-page2',
                //     name: '控制策略',
                //     icon: <CrownFilled />,
                //     component: './Welcome',
                // },
            ],
        },
        {
            path: '/log-management',
            name: '日志管理',
            icon: <BarsOutlined />,
            routes: [
                {
                    path: '/log/users',
                    name: '用户上下线日志',
                },
                {
                    path: '/log/proxy',
                    name: '代理检测日志',
                },
                // {
                //     path: '/admin/sub-page2',
                //     name: '控制策略',
                //     icon: <CrownFilled />,
                //     component: './Welcome',
                // },
            ],
        },
        {
            path: '/setting',
            name: '系统管理',
            icon: <SettingOutlined />,
            routes: [
                {
                    path: '/setting/config',
                    name: '配置管理',
                },
                {
                    path: '/setting/change-password',
                    name: '修改密码',
                },
                {
                    path: '/setting/authorization',
                    name: '系统授权',
                }
            ]
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
            title="DPI Analyze 终端设备识别"
            logo={ <img alt="" src={ logo }/> }
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
                        {localStorage.getItem('username') || user?.username || 'Guest'}
                    </span>
                </Dropdown>,
            ]}
        >
            <Outlet />
        </ProLayout>
    );
};

export default MainLayout;
