import React from 'react';
import {ProLayout} from '@ant-design/pro-components';
import {Outlet, useNavigate} from 'react-router-dom';
import {Dropdown, Menu} from 'antd';
import {
    AreaChartOutlined,
    BarsOutlined,
    CrownFilled,
    DashboardOutlined,
    DatabaseOutlined,
    DeploymentUnitOutlined,
    EyeOutlined,
    LaptopOutlined,
    LogoutOutlined,
    PaperClipOutlined,
    PushpinOutlined,
    SendOutlined,
    SettingOutlined,
    SwapOutlined
} from '@ant-design/icons';
import {useAuth} from '../context/AuthContext';
import logo from '../assets/srun.svg';

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
            routes: [
                {
                    path: '/dashboard',
                    name: '仪表盘',
                    icon: <DashboardOutlined/>,
                },
                {
                    path: '/terminal',
                    name: '疑似共享终端趋势图',
                }
            ],
        },
        {
            path: '/terminal-identification',
            name: '终端识别',
            icon: <DeploymentUnitOutlined/>,
            routes: [
                {
                    path: '/terminal/identification',
                    name: '终端类型识别',
                    icon: <PushpinOutlined/>,
                },
                {
                    path: '/terminal/useragent',
                    name: 'UA特征识别',
                    icon: <CrownFilled/>,
                },
                {
                    path: '/terminal/application',
                    name: '应用识别',
                    icon: <CrownFilled/>,
                },
            ],
        },
        {
            path: '/feature-judgment',
            name: '特征判定',
            icon: <PaperClipOutlined/>,
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
                {
                    path: '/feature-judgment/feature-library',
                    name: '行为分析和判定策略'
                },
                {
                    path: '/feature-judgment/feature-library',
                    name: '实时告警和反馈机制'
                }
            ],
        },
        {
            path: '/statics/activity',
            name: '系统统计图表',
            icon: <AreaChartOutlined />,
            routes: [
                {
                    path: '/statics/activity',
                    name: '用户终端区域报表',
                },
                {
                    path: '/',
                    name: '实时共享终端判定图表',
                },
                {
                    path: '/',
                    name: 'UA特征识别统计图表',
                },
                {
                    path: '/',
                    name: '应用特征识别统计图表',
                },
                {
                    path: '/statics/terminal',
                    name: '终端类型识别图表',
                }
            ],
        },
        {
            path: '/policy-configuration',
            name: '策略配置',
            icon: <SettingOutlined/>,
            routes: [
                {
                    path: '/policy/access',
                    name: '准入策略',
                },
                {
                    path: '/strategy/control/index',
                    name: '控制策略',
                },
            ],
        },
        {
            name: '策略管理',
            icon: <LogoutOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '策略优化',
                },
                {
                    path: '/',
                    name: '策略同步',
                }
            ],
        },
        {
            path: '/network/default',
            name: '策略执行',
            icon: <SendOutlined />,
            routes: [
                {
                    path: '/network/default',
                    name: '告警反馈',
                },
                {
                    path: '/log/detail',
                    name: '强制下线',
                },
                {
                    path: '/',
                    name: '降速策略',
                },
                {
                    path: '/',
                    name: '账号停用',
                },
                // {
                //     path: '/network/default',
                //     name: '策略评估与优化',
                // }
            ]
        },
        {
            path: '/setting',
            name: '系统管理',
            icon: <SettingOutlined/>,
            routes: [
                {
                    path: '/auth/assign/index',
                    name: '管理员操作',
                },
                {
                    path: '/report/dashboard/index',
                    name: '监控与报告',
                },
                {
                    path: '/message/message/index',
                    name: '警告页面管理',
                },
                {
                    path: '/',
                    name: '备份与恢复',
                },
                {
                    path: '/setting/sms/index',
                    name: '短信网关',
                },
                {
                    path: '/setting/email/index',
                    name: '邮箱服务',
                },
                {
                    path: '/setting/email/index',
                    name: '邮箱模板',
                },
                {
                    path: '/message/mesgploy/index',
                    name: '通知设置',
                },
                {
                    path: '/interface/binding/index',
                    name: '北向接口授权',
                },
                {
                    path: '/interfaces/default/index',
                    name: '外部地址矩阵',
                },
                {
                    path: '/setting/config',
                    name: '配置管理',
                },
                {
                    path: '/user/manager/safe',
                    name: '管理员密码强度设置',
                },
                {
                    path: '/',
                    name: '网站展示配置',
                },
                {
                    path: '/setting/dictionary/index',
                    name: '字典管理'
                },
                {
                    path: '/strategy/zone-set/index',
                    name: '用户终端区域管理',
                },
                {
                    path: '/',
                    name: '联系人管理',
                },
                {
                    path: '/strategy/ip/index',
                    name: '规则管理',
                },
                {
                    path: '/',
                    name: 'OneNet自注册',
                },
                {
                    path: '/',
                    name: '敏感字符管理',
                },
                {
                    path: '/setting/change-password',
                    name: '修改密码',
                },
                {
                    path: '/setting/authorization',
                    name: '系统授权',
                },
            ]
        },
        {
            path: '/log-management',
            name: '日志管理',
            icon: <BarsOutlined/>,
            routes: [
                // {
                //     path: '/log/users',
                //     name: '用户上下线日志',
                // },
                {
                    path: '/log/proxy',
                    name: '防私接日志',
                },
                {
                    path: '/log/system/index',
                    name: '系统日志',
                },
                {
                    path: '/log/operate/index',
                    name: '操作日志',
                },
                {
                    path: '/message/sendmsg/index',
                    name: '短信日志',
                },
                // {
                //     path: '/message/sendmsg/index',
                //     name: '邮件日志'
                // },
                {
                    path: '/log/login/list',
                    name: '登录日志',
                },
                {
                    path: '/',
                    name: '告警提醒页面访问日志',
                },
                {
                    path: '/',
                    name: '日志存储与备份',
                },
                {
                    path: '/',
                    name: '安全与合规',
                }
            ],
        },
        {
            path: '/report/monitor/index',
            name: '监控模块',
            icon: <EyeOutlined />,
        },
        {
            path: '/',
            name: 'IPv6支持',
            icon: <SwapOutlined />,
        },
        {
            name: '报表管理',
            icon: <BarsOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '防私接报表',
                },
                {
                    path: '/',
                    name: '历史防私接报表',
                },
                {
                    path: '/',
                    name: '数据导出功能',
                },
                {
                    path: '/',
                    name: '报表安全性',
                }
            ],
        },
        {
            name: '用户体验优化',
            icon: <BarsOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '误拦截处理',
                },
                {
                    path: '/',
                    name: '容错处理配置',
                },
                {
                    path: '/',
                    name: '国际化支持',
                }
            ],
        },
        {
            path: '/',
            name: 'OneCyber 5G专网运营平台业务融合',
            icon: <LaptopOutlined />,
        },
        {
            name: '后台调度管理',
            icon: <BarsOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '系统概况',
                },
                {
                    path: '/',
                    name: '任务管理',
                },
                {
                    path: '/',
                    name: '分组管理',
                }
            ],
        },
        {
            name: '消息中心',
            icon: <BarsOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '站内消息',
                },
                {
                    path: '/',
                    name: '基本消息设置',
                }
            ],
        },
        {
            name: '个人设置',
            icon: <BarsOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '登录设备管理',
                },
                {
                    path: '/',
                    name: '登录安全设置',
                },
                {
                    path: '/',
                    name: '主题设置',
                },
                {
                    path: '/',
                    name: '显示语言设置',
                }
            ],
        },
        {
            path: '/user/online/index',
            name: '在线管理',
            icon: <DatabaseOutlined />,
        },
        {
            name: '系统环境配置',
            icon: <BarsOutlined/>,
            routes: [
                {
                    path: '/',
                    name: '条件集合管理',
                },
                {
                    path: '/',
                    name: '区域管理',
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
            title="5G专网终端特征识别系统"
            logo={<img alt="" src={logo}/>}
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
                    <span style={{cursor: 'pointer'}}>
                        {localStorage.getItem('username') || user?.username || 'Guest'}
                    </span>
                </Dropdown>,
            ]}
        >
            <Outlet/>
        </ProLayout>
    );
};

export default MainLayout;
