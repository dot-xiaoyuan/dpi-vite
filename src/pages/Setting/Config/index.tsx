import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, message, Row, Spin, Switch, Tabs} from "antd";
import {GetConfig, UpdateConfig}        from "../../../services/apiService.ts";
import { EditableProTable, ProColumns } from '@ant-design/pro-components'

type ThresholdType = {
    name: string;
    normal: string;
    remark: string;
    threshold: number;
}

const {TabPane} = Tabs;

const ConfigForm: React.FC = () => {
    const [config, setConfig] = useState<any | null>(null); // 存储接口返回的数据
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState<readonly ThresholdType[]>([]);
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);


    const columns: ProColumns<ThresholdType>[] = [
        {
            title: '阈值名称',
            dataIndex: 'name',
            readonly: true,
        },
        {
            title: '阈值说明',
            dataIndex: 'normal',
            readonly: true,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            readonly: true,
        },
        {
            title: '阈值',
            dataIndex: 'threshold',
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (_text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.name);
                    }}
                >
                    编辑
                </a>,
            ],
        },
    ]

    const thresholdList = () => {
        return Object.keys(config.thresholds).map((key: string) => ({
            name: key,
            ...config.thresholds[key]
        }))
    }

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

    const handleUpdate = async (rowKey: any, data: any) => {
        const updatedDate = {
            [rowKey] : {
                normal: data.normal,
                remark: data.remark,
                threshold: Number(data.threshold),
            }
        }
        const thresholds: any =  dataSource.reduce((acc, item: any) => {
            acc[item.name] = {
                normal: item.normal,
                remark: item.remark,
                threshold: item.threshold,
            };
            return acc;
        }, {} as { [key: string]: { normal: string; remark: string; threshold: number } });

        try {
            const res: any = await UpdateConfig({
                thresholds: {
                    ...thresholds,
                    ...updatedDate
                }
            });
            if (res.code == 0) {
                message.success("编辑成功");
            } else {
                message.error(res.message);
            }
        } catch (error) {
            message.error('编辑策略失败，请稍后再试！');
            console.error(error);
        }
    }

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
                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
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
                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
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
                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
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
                        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
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
                    <Row>
                        <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </TabPane>

            {/* 阈值配置 Tab */}
            <TabPane tab="阈值配置" key="3">
                <EditableProTable<ThresholdType>
                    rowKey="name"
                    scroll={{
                        x: 960,
                    }}
                    loading={false}
                    recordCreatorProps={false}
                    columns={columns}
                    request={async () => ({
                        data: thresholdList(),
                    })}
                    value={dataSource}
                    onChange={setDataSource}
                    editable={{
                        type: 'multiple',
                        editableKeys,
                        onSave: handleUpdate,
                        actionRender: (_, __, dom) => [dom.save, dom.cancel],
                        onChange: setEditableRowKeys,
                    }}
                />
            </TabPane>
        </Tabs>
    );
};

export default ConfigForm;
