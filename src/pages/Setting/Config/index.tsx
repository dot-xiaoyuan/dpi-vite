import { useState, useEffect } from 'react';
import { Tabs, Card, Switch, Input, InputNumber, message, Row, Col, Form, Select, Button } from 'antd';
import { GetConfig, UpdateConfig } from '../../../services/apiService.ts';

type ConfigSourceType = {
    language: string;
    log_level: string;
    debug: boolean;
    detach: boolean;
    ua_regular: string;
    berkeley_packet_filter: string;
    ignore_missing: boolean;
    follow_only_online_users: boolean;
    use_ttl: boolean;
    use_ua: boolean;
    use_feature: boolean;
    capture: {
        offline_file: string;
        nic: string;
        snap_len: number;
    };
    mongodb: {
        host: string;
        port: string;
    };
    redis: {
        dpi: { host: string; port: string; password: string; db: number };
        online: { host: string; port: string; password: string; db: number };
        cache: { host: string; port: string; password: string; db: number };
        users: { host: string; port: string; password: string; db: number };
    };
    web: {
        Port: number;
    };
    thresholds: {
        sni: { threshold: number; normal: string; remark: string };
        http: { threshold: number; normal: string; remark: string };
        tls_version: { threshold: number; normal: string; remark: string };
        cipher_suite: { threshold: number; normal: string; remark: string };
        session: { threshold: number; normal: string; remark: string };
        dns: { threshold: number; normal: string; remark: string };
        quic: { threshold: number; normal: string; remark: string };
        snmp: { threshold: number; normal: string; remark: string };
    };
    username: string;
    password: string;
};

const { TabPane } = Tabs;

export default () => {
    const [dataSource, setDataSource] = useState<ConfigSourceType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await GetConfig();
                setDataSource(res);
            } catch (error) {
                message.error('获取配置失败');
            }
        };
        fetchData();
    }, []);

    // 处理表单提交
    const handleSave = async (updatedData: any) => {
        try {
            const res = await UpdateConfig(updatedData);
            if (res?.code === 0) {
                message.success('配置更新成功');
                // 更新本地数据源
                setDataSource((prevData) => ({
                    ...prevData,
                    ...updatedData,
                }));
            } else {
                message.error('更新失败');
            }
        } catch (error) {
            message.error('更新配置失败');
        }
    };

    // 比较并获取修改的字段
    const getUpdatedFields = (formValues: any, originalData: any) => {
        const updatedFields: any = {};
        for (const key in formValues) {
            if (formValues[key] !== originalData[key]) {
                updatedFields[key] = formValues[key];
            }
        }
        return updatedFields;
    };

    // 如果数据源没有加载完成，展示加载中状态
    if (!dataSource) return <div>Loading...</div>;

    return (
        <Tabs defaultActiveKey="1">
            {/* 基本配置 */}
            <TabPane tab="基本配置" key="1">
                <Row gutter={24}>
                    <Col span={12}>
                        <Card title="基本配置" bordered={false}>
                            <Form
                                initialValues={dataSource}
                                onFinish={async (formValues) => {
                                    const updatedFields = getUpdatedFields(formValues, dataSource);
                                    if (Object.keys(updatedFields).length > 0) {
                                        handleSave(updatedFields);
                                    }
                                }}
                                labelCol={{ span: 6 }}
                            >
                                <Form.Item label="网卡配置" name="capture.nic">
                                    <Input />
                                </Form.Item>
                                <Form.Item label="日志级别" name="log_level">
                                    <Select>
                                        <Select.Option value="debug">debug</Select.Option>
                                        <Select.Option value="info">info</Select.Option>
                                        <Select.Option value="warn">warn</Select.Option>
                                        <Select.Option value="error">error</Select.Option>
                                        <Select.Option value="panic">panic</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="调试模式" name="debug" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Form.Item label="忽略缺失字节" name="ignore_missing" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Form.Item label="仅关注在线用户" name="follow_only_online_users" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Form.Item label="分析TTL" name="use_ttl" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Form.Item label="分析UA" name="use_ua" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Form.Item label="分析应用特征" name="use_feature" valuePropName="checked">
                                    <Switch />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 3 }}>
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </TabPane>

            {/* Redis 配置 */}
            <TabPane tab="Redis 配置" key="2">
                <Row gutter={[24, 16]}>
                    {Object.entries(dataSource.redis).map(([key, redisConfig]) => (
                        <Col span={12} key={key}>
                            <Card title={`${key} 配置`} bordered={false}>
                                <Form
                                    initialValues={redisConfig}
                                    onFinish={async (formValues) => {
                                        const updatedFields = getUpdatedFields(formValues, redisConfig);
                                        if (Object.keys(updatedFields).length > 0) {
                                            handleSave({
                                                redis: {
                                                    ...dataSource.redis,
                                                    [key]: updatedFields,
                                                },
                                            });
                                        }
                                    }}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 12 }}
                                >
                                    <Form.Item label="Host" name="host">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Port" name="port">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="密码" name="password">
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item wrapperCol={{ offset: 6 }}>
                                        <Button type="primary" htmlType="submit">
                                            保存
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </TabPane>

            {/* 阈值配置 */}
            <TabPane tab="阈值配置" key="3">
                <Row gutter={[24, 16]}>
                    {Object.entries(dataSource.thresholds).map(([key, thresholdConfig]) => (
                        <Col span={12} key={key}>
                            <Card title={`${key} 配置`} bordered={false}>
                                <Form
                                    initialValues={thresholdConfig}
                                    onFinish={async (formValues) => {
                                        const updatedFields = getUpdatedFields(formValues, thresholdConfig);
                                        if (Object.keys(updatedFields).length > 0) {
                                            handleSave({
                                                thresholds: {
                                                    ...dataSource.thresholds,
                                                    [key]: updatedFields,
                                                },
                                            });
                                        }
                                    }}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 20 }}
                                >
                                    <Form.Item label="阈值" name="threshold">
                                        <InputNumber min={10} />
                                    </Form.Item>

                                    <Form.Item label="正常描述" name="normal">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>

                                    <Form.Item label="备注" name="remark">
                                        <Input.TextArea rows={3} />
                                    </Form.Item>

                                    <Form.Item wrapperCol={{ offset: 4 }}>
                                        <Button type="primary" htmlType="submit">
                                            保存
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </TabPane>
        </Tabs>
    );
};
