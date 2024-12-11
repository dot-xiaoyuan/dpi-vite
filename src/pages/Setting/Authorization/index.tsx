import React, { useEffect, useState }    from 'react'
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components'
import { Row, Col, message }         from 'antd';
import { GetLicense, UpdateLicense } from '../../../services/apiService.ts'

const Authorization: React.FC = () => {
    const [config, setConfig] = useState<any | null>(null);

    const updateConfig = async (values: any) => {
        try {
            const res: any = await UpdateLicense(values); // 假设返回完整配置数据
            if (res.code == 0) {
                setConfig(res.data)
            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.error("Error fetching config:", error);
        }
    }

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res: any = await GetLicense(); // 假设返回完整配置数据
                if (res.code == 0) {
                    setConfig(res.data)
                } else {
                    message.error(res.message);
                }
            } catch (error) {
                console.error("Error fetching config:", error);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ProCard
        title="License 授权"
        style={{ width: '50%', minWidth: 300 }}
        >
            <ProForm
                layout="vertical"
                onFinish={async (values) => {
                    updateConfig(values);
                }}
            >
                {/* 系统版本 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <label>系统版本：</label>
                            <span>{config?.version || '-'}</span>
                        </div>
                    </Col>
                </Row>

                {/* 机器码 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <label>机器码：</label>
                            <span>{config?.machine_id || '-'}</span>
                        </div>
                    </Col>
                </Row>

                {/* 到期时间 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <label>到期时间：</label>
                            <span>{config?.expire_date || '-'}</span>
                        </div>
                    </Col>
                </Row>

                {/* 二维码 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' } }>
                            <label style={{ marginBottom: '8px' }}>请联系工作人员扫码二维码获取 License</label>
                            <img alt="Scan me!" src={config?.qrcode} style={{ width: 200 }} />
                        </div>
                    </Col>
                </Row>

                {/* 授权码 */ }
                <ProFormText
                    name="licenseKey"
                    label="或手动输入授权码"
                    placeholder="请输入授权码"
                    rules={ [
                        { required: true, message: '授权码不能为空！' },
                    ] }
                />
            </ProForm>
        </ProCard>
    )
}

export default Authorization


