import React from 'react';
import {LoginForm, ProConfigProvider, ProFormText} from '@ant-design/pro-components';
import {message} from 'antd';
import {BarChartOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import './index.css';
import {login} from "../../services/authService.ts";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const handleLogin = async (values: { username: string; password: string }) => {
        try {
            const response = await login(values.username, values.password);
            const token = response.data.token;
            localStorage.setItem('username', values.username);
            localStorage.setItem('auth_token', token);
            if (response && response.data.message === 'Login successful') {
                message.success('登录成功！');
                navigate('/dashboard'); // 跳转到仪表盘页面
            } else {
                message.error('登录失败，请检查用户名或密码！');
            }
        } catch (error) {
            message.error('登录过程中发生错误，请稍后再试！');
            console.error(error);
        }
    };
    return (
        <ProConfigProvider hashed={false}>
            <div>
                <LoginForm
                    logo={<BarChartOutlined style={{fontSize: '3rem'}}/>}
                    title="DPI-Analyze"
                    subTitle=" "
                    onFinish={handleLogin}
                >
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'}/>,
                            }}
                            placeholder={'用户名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'}/>,
                            }}
                            placeholder={'密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};

export default LoginPage;
