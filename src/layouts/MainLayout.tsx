import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Outlet, useNavigate } from 'react-router-dom';
import { Dropdown, Menu, Space } from 'antd';
import {UserOutlined, LogoutOutlined, DashboardOutlined} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth(); // 从 AuthContext 获取用户信息

    const handleLogout = async () => {
        await logout(); // 处理登出逻辑
        navigate('/login'); // 跳转到登录页
    };

    const menuItems = [
        {
            path: '/dashboard',
            name: 'Dashboard',
            icon: <DashboardOutlined />,
        },
        {
            path: '/settings',
            name: 'Settings',
            icon: <UserOutlined />,
        },
    ];

    const userMenu = (
        <Menu
            items={[
                {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: handleLogout,
                },
            ]}
        />
    );

    return (
        <ProLayout
            title="DPI Analyze"
            logo={<UserOutlined />}
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
                        <span style={{ cursor: 'pointer' }}>{user?.username || 'Guest'}</span>
                    </Dropdown>
                </Space>
            )}
        >
            {/*<div style={{ padding: 24 }}>*/}
                <Outlet /> {/* 子路由内容渲染 */}
            {/*</div>*/}
        </ProLayout>
    );
};

export default MainLayout;
