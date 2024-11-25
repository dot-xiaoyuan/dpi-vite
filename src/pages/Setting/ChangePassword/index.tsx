import React, { useState, useCallback } from 'react'
import { ProCard } from '@ant-design/pro-components'
import { Form, Input, Space, Button, Modal, message } from 'antd'
import { useAuth } from '../../../context/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import SHA256 from 'crypto-js/sha256'
import { ChangePass } from '../../../services/apiService.ts'

const ChangePassword: React.FC = () => {
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { logout } = useAuth()
    const navigate = useNavigate()

    // 提交表单处理函数
    const submit = useCallback(async () => {
        try {
            const values = await form.validateFields()
            const oldPass = SHA256(values.currentPassword).toString()
            const newPass = SHA256(values.newPassword).toString()

            const response = await ChangePass(oldPass, newPass);
            console.log('---res',response)
            if (response?.code === 0) {
                // 修改成功，打开弹窗
                setIsModalOpen(true)
            } else {
                message.error(response.message)
            }
        } catch (error) {
            message.error('网络请求失败，请联系管理员！')
            console.log('表单验证失败:', error)
        }
    }, [form])

    // 重置表单
    const onReset = useCallback(() => {
        form.resetFields()
    }, [form])

    // 弹窗确认处理
    const handleOk = useCallback(async () => {
        try {
            await logout()
            navigate('/login')
        } catch (error) {
            message.error('登出失败，请稍后再试！')
            console.log('登出失败:', error)
        }
    }, [logout, navigate])

    return (
        <>
            <ProCard
                title="修改密码"
                style={{ width: '50%', minWidth: 300 }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="change-password"
                    initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    }}
                    onFinish={submit}
                >
                    <Form.Item
                        name="currentPassword"
                        label="请输入当前密码"
                        rules={[{ required: true, message: '当前密码不能为空!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="请输入新密码"
                        rules={[{ required: true, message: '新密码不能为空!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="请确认新密码"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: '两次密码输入不一致!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('两次密码输入不一致!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                确认修改
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                重置
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </ProCard>

            {/* 提示弹窗 */}
            <Modal
                title="密码修改成功！"
                centered
                open={isModalOpen}
                onOk={handleOk}
                footer={[
                    <Button key="ok" type="primary" onClick={handleOk}>
                        确定
                    </Button>
                ]}
            >
                <p>请重新进行认证</p>
            </Modal>
        </>
    )
}

export default ChangePassword
