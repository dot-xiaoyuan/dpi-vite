import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, message, Row, Spin, Switch, Tabs} from "antd";
import {GetConfig, UpdateConfig} from "../../../services/apiService.ts";

const {TabPane} = Tabs;

const ConfigForm: React.FC = () => {
    const [config, setConfig] = useState<any | null>(null); // 存储接口返回的数据
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await GetConfig(); // 假设返回完整配置数据
                setConfig(response.data); // 存储返回的数据
            } catch (error) {
                console.error("Error fetching config:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const onFinish = async (values: any) => {
        try {
            // 这里你可以调用接口来提交表单数据
            const response: any = await UpdateConfig(values);
            if (response.code == 0) {
                message.success('修改成功！');
            } else {
                message.error(response.message);
            }
            console.log("Submitted values:", values);
            // 例如：await apiClient.post("/update-config", values);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (loading) {
        return <Spin size="large"/>;
    }

    if (!config) {
        return <div>Error: Failed to load config</div>;
    }

    return (
        <Tabs defaultActiveKey="1">
            {/* 基础配置 Tab */}
            <TabPane tab="基础配置" key="1">
                <Row gutter={24}>
                    <Col span={6}>
                        <Card>
                            <Form
                                layout="horizontal"
                                labelCol={{span: 6}}
                                wrapperCol={{span: 10, offset: 12}}
                                style={{maxWidth: 600}}
                                initialValues={config}
                                onFinish={onFinish}
                            >
                                <Form.Item label="调试模式" key="debug" name="debug">
                                    <Switch />
                                </Form.Item>
                                <Form.Item label="开启TTL分析" key="use_ttl" name="use_ttl">
                                    <Switch />
                                </Form.Item>
                                <Form.Item label="开启特征分析" key="use_feature" name="use_feature">
                                    <Switch />
                                </Form.Item>
                                <Form.Item label="开启UA分析" key="use_ua" name="use_ua">
                                    <Switch />
                                </Form.Item>
                                <Form.Item label="仅关注在线用户" key="follow_only_online_users" name="follow_only_online_users">
                                    <Switch />
                                </Form.Item>
                                <Form.Item wrapperCol={{span: 6, offset: 10}}>
                                    <Button type="primary" htmlType="submit">
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </TabPane>

            {/* Redis 配置 Tab */}
            <TabPane tab="Redis 配置" key="2">
                <Form
                    layout="horizontal"
                    // labelCol={{span: 6}}
                    // wrapperCol={{span: 10, offset: 12}}
                    // style={{maxWidth: 600}}
                    initialValues={config}
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={6}>
                            <Card title="DPI">
                                <Form.Item label="地址" name={['redis', 'dpi', 'host']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="端口" name={['redis', 'dpi', 'port']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="密码" name={['redis', 'dpi', 'password']}>
                                    <Input.Password/>
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Online">
                                <Form.Item label="地址" name={['redis', 'online', 'host']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="端口" name={['redis', 'online', 'port']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="密码" name={['redis', 'online', 'password']}>
                                    <Input.Password/>
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Users">
                                <Form.Item label="地址" name={['redis', 'users', 'host']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="端口" name={['redis', 'users', 'port']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="密码" name={['redis', 'users', 'password']}>
                                    <Input.Password/>
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title="Cache">
                                <Form.Item label="地址" name={['redis', 'cache', 'host']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="端口" name={['redis', 'cache', 'port']}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item label="密码" name={['redis', 'cache', 'password']}>
                                    <Input.Password/>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                    <Form.Item wrapperCol={{span: 6, offset: 10}}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </TabPane>

            {/* 阈值配置 Tab */}
            <TabPane tab="阈值配置" key="3">
                <Form layout="vertical">
                    {/* 阈值配置 */}
                    {/*<Form.Item label="SNI Threshold" key="sniThreshold">*/}
                    {/*    <Input defaultValue={config.thresholds.sni} />*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item label="HTTP Threshold" key="httpThreshold">*/}
                    {/*    <Input defaultValue={config.thresholds.http} />*/}
                    {/*</Form.Item>*/}
                </Form>
            </TabPane>
        </Tabs>
    );
};

export default ConfigForm;
