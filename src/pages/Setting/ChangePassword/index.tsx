import React, { useState }                   from 'react'
import { ProCard }                           from '@ant-design/pro-components'
import { Form, Input, Space, Button, Modal } from 'antd'
import { useAuth }                           from '../../../context/AuthContext.tsx'
import { useNavigate }                       from 'react-router-dom'
import SHA256                                from 'crypto-js/sha256'

const ChangePassword: React.FC = () => {
    const [form]                        = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { logout }                    = useAuth() // 从 AuthContext 获取用户信息
    const navigate                      = useNavigate()


    // 提交
    const submit = async () => {
        try {
            const values = await form.validateFields()
            const oldPass = SHA256(values.currentPassword).toString()
            const newPass = SHA256(values.newPassword).toString()
            // TODO: 请求接口
            setIsModalOpen(true) // 请求成功

        } catch (error) {
            console.log('表单验证失败:', error)
        }
    }

    // 重置
    const onReset = () => {
        form.resetFields()
    }

    const handleOk = async () => {
        // 取消登录状态
        await logout() // 处理登出逻辑
        navigate('/login') // 跳转到登录页
    }

    return (
        <>
            <ProCard
                title="修改密码"
                style={ { width: '50%', minWidth: 300 } }
                boxShadow
            >
                <Form
                    form={ form }
                    layout="vertical"
                    name="change-password"
                    initialValues={ {
                        currentPassword: '',
                        newPassword    : '',
                        confirmPassword: '',
                    } }
                    onFinish={ submit }
                >
                    <Form.Item
                        name="currentPassword"
                        label="请输入当前密码"
                        rules={ [{ required: true, message: '当前密码不能为空!' }] }
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="请输入新密码"
                        rules={ [{ required: true, message: '新密码不能为空!' }] }
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="请确认新密码"
                        dependencies={ ['newPassword'] }
                        rules={ [
                            { required: true, message: '两次密码输入不一致!' },
                            ({ getFieldValue }) => ({
                                validator (_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('两次密码输入不一致!'))
                                },
                            }),
                        ] }
                    >
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                确认修改
                            </Button>
                            <Button htmlType="button" onClick={ onReset }>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </ProCard>

            {/*提示弹窗*/ }
            <Modal title="密码修改成功！" centered open={ isModalOpen } onOk={ handleOk } footer={ [
                <Button key="ok" type="primary" onClick={ handleOk }>
                    确定
                </Button>
            ] }>
                <p>请重新进行认证</p>
            </Modal>
        </>
    )
}

export default ChangePassword
