import React, {useEffect, useState} from 'react';
import {ProCard, ProForm, ProFormText} from '@ant-design/pro-components';
import {Row, Col, message} from 'antd';
import {GetLicense, UpdateLicense} from '../../../services/apiService.ts';

const Authorization: React.FC = () => {
    const [config, setConfig] = useState<any | null>(null);

    const updateConfig = async (values: any) => {
        try {
            const res: any = await UpdateLicense(values); // 假设返回完整配置数据
            if (res.code === 0) {
                setConfig(res.data);
                message.success('License 更新成功');
            } else {
                message.error(res.message || '更新失败');
            }
        } catch (error) {
            console.error("Error updating config:", error);
            message.error('更新失败，请稍后再试');
        }
    };

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res: any = await GetLicense(); // 假设返回完整配置数据
                if (res.code === 0) {
                    setConfig(res.data);
                } else {
                    message.error(res.message || '获取配置失败');
                }
            } catch (error) {
                console.error("Error fetching config:", error);
                message.error('获取配置失败，请稍后再试');
            }
        };

        fetchConfig();
    }, []);

    return (
        <ProCard
            title="License 授权"
            style={{
                width: '100%',
                maxWidth: 600,
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'left',
            }}
            bordered
        >
            <ProForm
                layout="vertical"
                onFinish={async (values) => {
                    await updateConfig(values);
                }}
            >
                {/* 系统版本 */}
                <Row gutter={[16, 16]} style={{marginBottom: "16px"}}>
                    <Col xs={24} sm={6}>
                        <strong>系统版本：</strong>
                    </Col>
                    <Col xs={24} sm={18}>
                        <div style={{color: '#333'}}>{config?.version || '-'}</div>
                    </Col>
                </Row>

                {/* 机器码 */}
                <Row gutter={[16, 16]} style={{marginBottom: "16px"}}>
                    <Col xs={24} sm={6}>
                        <strong>机器码：</strong>
                    </Col>
                    <Col xs={24} sm={18}>
                        <div style={{color: '#333'}}>{config?.machine_id || '-'}</div>
                    </Col>
                </Row>

                {/* 授权码 */}
                <Row gutter={[16, 16]} style={{marginBottom: "16px"}}>
                    <Col xs={24} sm={6}>
                        <strong>授权码：</strong>
                    </Col>
                    <Col xs={24} sm={18}>
                        <div style={{color: '#333'}}>{config?.license_code || '-'}</div>
                    </Col>
                </Row>

                {/* 到期时间 */}
                <Row gutter={[16, 16]} style={{marginBottom: "16px"}}>
                    <Col xs={24} sm={6}>
                        <strong>到期时间：</strong>
                    </Col>
                    <Col xs={24} sm={18}>
                        <div style={{color: '#333'}}>{config?.expire_date && config?.license_code ? config.expire_date : '-'}</div>
                    </Col>
                </Row>

                {/* 二维码 */}
                <Row gutter={[16, 16]} style={{marginBottom: "20px"}}>
                    <Col xs={24} sm={6}>
                        <strong>二维码：</strong>
                    </Col>
                    <Col xs={24} sm={18}>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                            <label style={{marginBottom: '8px', color: '#888'}}>
                                请联系工作人员扫码二维码获取 License
                            </label>
                            <img
                                alt="Scan me!"
                                src={config?.qrcode}
                                style={{width: '200px', maxWidth: '100%'}}
                            />
                        </div>
                    </Col>
                </Row>

                {/* 授权码输入 */}
                <ProFormText
                    name="license_code"
                    label="或手动输入授权码"
                    placeholder="请输入授权码"
                    rules={[{required: true, message: '授权码不能为空！'}]}
                    style={{marginBottom: '20px'}}
                    // initialValue={config?.license_code}
                />
            </ProForm>
        </ProCard>
    );
};

export default Authorization;
