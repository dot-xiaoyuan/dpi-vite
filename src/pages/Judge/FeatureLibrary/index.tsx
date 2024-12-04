import {useEffect, useState} from 'react';
import {PageContainer} from '@ant-design/pro-components';
import {Button, Card, Form, Input, message, Modal, Select, Space, Table, Tabs, Tag} from 'antd';
import {PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {GetFeatureLibrary, JudgeRealtime} from "../../../services/apiService.ts";
import {dashboard} from "../../../services/authService.ts";

const {TabPane} = Tabs;

// 模拟数据
const dataSource = [
    {
        key: '1',
        type: 'UA特征',
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        source: '系统自动',
        updatedAt: '2024-01-01 12:00',
    },
    {
        key: '2',
        type: 'MAC特征',
        value: '00:1A:79:XX:XX:XX',
        source: '管理员手动',
        updatedAt: '2024-01-02 15:00',
    },
];

const FeatureLibrary = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    // 添加特征条目
    const handleAddFeature = () => {
        form.validateFields().then((values) => {
            message.success(`成功添加特征：${values.value}`);
            setModalVisible(false);
        });
    };

    useEffect(() => {
        GetFeatureLibrary().then((res) => {

        })
    }, []);
    return (
        <PageContainer title="特征库更新管理" subTitle="维护终端指纹特征库">
            <Card>
                <Tabs defaultActiveKey="1">
                    {/* 特征库总览 */}
                    <TabPane tab="特征库总览" key="1">
                        <Card title="特征统计">
                            <Space>
                                <div>
                                    <h3>特征类型分布</h3>
                                    <Tag color="blue">UA特征: 120</Tag>
                                    <Tag color="green">MAC特征: 80</Tag>
                                    <Tag color="orange">协议特征: 40</Tag>
                                </div>
                            </Space>
                        </Card>
                    </TabPane>

                    {/* 特征更新管理 */}
                    <TabPane tab="特征更新管理" key="2">
                        <Card title="自动更新设置" extra={<Button type="primary">立即更新</Button>}>
                            <Space direction="vertical">
                                <div>数据源：厂商数据库、社区贡献库</div>
                                <div>更新频率：每日自动更新</div>
                            </Space>
                        </Card>
                        <Card title="更新日志" style={{marginTop: 16}}>
                            <Table
                                dataSource={dataSource}
                                columns={[
                                    {
                                        title: '更新时间',
                                        dataIndex: 'updatedAt',
                                        key: 'updatedAt',
                                    },
                                    {
                                        title: '更新条目数',
                                        dataIndex: 'count',
                                        key: 'count',
                                        render: () => '20',
                                    },
                                    {
                                        title: '数据来源',
                                        dataIndex: 'source',
                                        key: 'source',
                                    },
                                    {
                                        title: '更新状态',
                                        dataIndex: 'status',
                                        key: 'status',
                                        render: () => <Tag color="success">成功</Tag>,
                                    },
                                ]}
                            />
                        </Card>
                    </TabPane>

                    {/* 手动维护 */}
                    <TabPane tab="手动维护" key="3">
                        <Card
                            title="特征条目管理"
                            extra={
                                <Space>
                                    <Button icon={<UploadOutlined/>}>批量导入</Button>
                                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => setModalVisible(true)}>
                                        添加特征
                                    </Button>
                                </Space>
                            }
                        >
                            <Table
                                dataSource={dataSource}
                                columns={[
                                    {
                                        title: '特征类型',
                                        dataIndex: 'type',
                                        key: 'type',
                                        render: (text) => <Tag color="blue">{text}</Tag>,
                                    },
                                    {
                                        title: '特征值',
                                        dataIndex: 'value',
                                        key: 'value',
                                    },
                                    {
                                        title: '数据来源',
                                        dataIndex: 'source',
                                        key: 'source',
                                    },
                                    {
                                        title: '更新时间',
                                        dataIndex: 'updatedAt',
                                        key: 'updatedAt',
                                    },
                                    {
                                        title: '操作',
                                        key: 'action',
                                        render: () => (
                                            <Space>
                                                <Button size="small">编辑</Button>
                                                <Button size="small" danger>
                                                    删除
                                                </Button>
                                            </Space>
                                        ),
                                    },
                                ]}
                            />
                        </Card>
                    </TabPane>
                </Tabs>
            </Card>

            {/* 添加特征模态框 */}
            <Modal
                title="添加新特征"
                visible={isModalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleAddFeature}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="特征类型" name="type" rules={[{required: true, message: '请选择特征类型'}]}>
                        <Select placeholder="请选择特征类型">
                            <Select.Option value="UA特征">UA特征</Select.Option>
                            <Select.Option value="MAC特征">MAC特征</Select.Option>
                            <Select.Option value="协议特征">协议特征</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="特征值" name="value" rules={[{required: true, message: '请输入特征值'}]}>
                        <Input placeholder="请输入特征值"/>
                    </Form.Item>
                </Form>
            </Modal>
        </PageContainer>
    );
};

export default FeatureLibrary;
