import React from 'react';
import {ProLayout} from '@ant-design/pro-components';
import {Outlet, useNavigate} from 'react-router-dom';
import {Dropdown, Menu, Space} from 'antd';
import {BarChartOutlined, DashboardOutlined, LogoutOutlined} from '@ant-design/icons';
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
            name: 'Dashboard',
            icon: <DashboardOutlined/>,
        },
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
            title="DPI Analyze"
            logo={<BarChartOutlined/>}
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
            rightContentRender={() => (
                <Space>
                    <Dropdown overlay={userMenu}>
                        <span style={{cursor: 'pointer'}}>{user?.username || 'Guest'}</span>
                    </Dropdown>
                </Space>
            )}
            contentWidth="Fixed"
        >
            <Outlet/>
        </ProLayout>
    );
};

export default MainLayout;
