import React                                           from 'react'
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components'
import { Row, Col }                                    from 'antd';

const Authorization: React.FC = () => {
    // 示例数据
    const currentVersion = "v1.5.3"; // 当前系统版本
    const expiryDate = "2025-12-31"; // 到期时间

    return (
        <ProCard
        title="License 授权"
        style={{ width: '50%', minWidth: 300 }}
        >
            <ProForm
                layout="vertical"
                onFinish={async (values) => {
                    console.log('提交数据:', values);
                }}
            >
                {/* 系统版本 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <label>系统版本：</label>
                            <span>{currentVersion}</span>
                        </div>
                    </Col>
                </Row>

                {/* 到期时间 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <label>到期时间：</label>
                            <span>{expiryDate}</span>
                        </div>
                    </Col>
                </Row>

                {/* 二维码 */}
                <Row gutter={24} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <div style={ { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' } }>
                            <label style={{ marginBottom: '8px' }}>请联系工作人员扫码二维码获取 License</label>
                            <img alt="Scan me!"
                                     src="data:image/png;base64,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"
                                />
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
                        { min: 10, message: '授权码至少10个字符' },
                    ] }
                />
            </ProForm>
        </ProCard>
    )
}

export default Authorization


