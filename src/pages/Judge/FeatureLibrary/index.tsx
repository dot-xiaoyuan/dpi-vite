import React, {useEffect, useState} from 'react';
import {PageContainer, ProCard} from '@ant-design/pro-components';
import {Button, Card, Form, Input, message, Modal, Select, Space, Table, Tabs, Tag, Statistic, Badge, Upload} from 'antd';
import type { UploadProps } from 'antd';
import {PlusOutlined, UploadOutlined, RedoOutlined}               from '@ant-design/icons';
import { GetFeatureLibrary, UpdateFeatureLibrary, UploadFeature } from "../../../services/apiService.ts";
import './index.css';


const {TabPane} = Tabs;
const {Divider} = ProCard;

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
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [responsive] = useState(false);
    const [selectedValue, setSelectedValue] = useState(undefined);
    const [featureData, setFeatureData] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [filePath, setFilePath] = useState(undefined);
    const [updateLog, setUpdateLog] = useState(undefined);
    const [form] = Form.useForm();
    const [] = useState(false);

    // 添加特征条目
    const handleAddFeature = () => {
        form.validateFields().then((values) => {
            message.success(`成功添加特征：${values.value}`);
            setModalVisible(false);
        });
    };

    // 选择特征类型
    const handleSelectChange = (value: any) => {
        setSelectedValue(value);
        setUpdateLog(featureData.find((item: any) => item.module === value)?.history || [])
    };

    // 更新特征
    const updateFeature = () => {
        // 打开弹窗
        setIsUpdateOpen(true);
    };

    // 确认上传
    const updateOk = async () => {
        setIsUpdateOpen(false);
        const params = {
            module: selectedValue,
            path: filePath,
        }
        // 更新特征库
        try {
            const res = await UpdateFeatureLibrary(params);

            // 更新日志
            setUpdateLog(res.data.find((item: any) => item.module === selectedValue)?.history || [])

        } catch (error) {
            message.error('更新失败，请重试！');
        }
    };

    // 取消上传
    const updateCancel = () => {
        setIsUpdateOpen(false);
        setFileList([]);
    };

    // 特征更新-上传文件
    const uploadProps: UploadProps = {
        name: 'file',
        maxCount: 1,
        fileList,
        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                const result = await UploadFeature(file);

                setFilePath(result.data);

                onSuccess(result);
            } catch (error) {
                onError(error);
            }
        },

        onChange(info) {
            // @ts-ignore
            setFileList(info.fileList);
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
    };

    useEffect(() => {
        GetFeatureLibrary().then((res) => {
            setFeatureData(res.data);
            setSelectedValue(res.data.length > 0 ? res.data[0].module : '');
            setUpdateLog(res.data.length > 0 ? res.data[0].history : [])
        })
    }, []);
    return (
        <PageContainer
            title="特征库更新管理"
            subTitle="维护终端指纹特征库"
            header={{
                breadcrumb: {},
            }}>
            <Card>
                <Tabs defaultActiveKey="1">
                    {/* 特征库总览 */}
                    <TabPane tab="特征库总览" key="1">
                        <Card title="特征统计">
                            <h3>特征类型分布</h3>
                            <ProCard.Group direction="row">
                                {featureData?.length > 0 ? (
                                    featureData.map((item:any, index) => (
                                        <React.Fragment key={index}>
                                            <ProCard style={{width: 200, display: 'inline-block'}} className="custom-card">
                                                <Statistic title={<span>{item.name} <Badge count={item.version} style={{ marginLeft: 8, display: "block", backgroundColor: '#1677FF' }} /></span>}
                                                           value={item.count}
                                                           style={{width: 200}} />
                                            </ProCard>
                                            {index < featureData.length - 1 && (
                                                <Divider type={responsive ? 'horizontal' : 'vertical'} style={{display: 'inline-block'}} />
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <ProCard>Loading...</ProCard>
                                )}
                            </ProCard.Group>
                        </Card>
                    </TabPane>

                    {/* 特征更新管理 */}
                    <TabPane tab="特征更新管理" key="2">
                        <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                            <Space>
                                <Select
                                        style={{ width: 250 }}
                                        defaultValue={featureData.length > 0 ? featureData[0].module : ''}
                                        options={featureData.map((item: any) => ({
                                            label: item.name,   // 显示在下拉框中的文本
                                            value: item.module,  // 选中的值
                                        }))}
                                        onChange={handleSelectChange}
                                        placeholder="请选择需要更新的特征类型"
                                    />
                                <Button icon={<RedoOutlined />} onClick={updateFeature}>更新</Button>
                            </Space>
                            <Modal title="上传特征库更新文件" centered open={isUpdateOpen} onOk={updateOk} onCancel={updateCancel}>
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>上传</Button>
                                </Upload>
                            </Modal>
                        </Space>
                        <Card title="更新日志" style={{marginTop: 16}}>
                            <Table
                                dataSource={updateLog}
                                columns={[
                                    {
                                        title: '更新时间',
                                        dataIndex: 'timestamp',
                                        key: 'timestamp',
                                    },
                                    {
                                        title: '更新条目数',
                                        dataIndex: 'change_number',
                                        key: 'change_number',
                                        render: () => '20',
                                    },
                                    // {
                                    //     title: '数据来源',
                                    //     dataIndex: 'source',
                                    //     key: 'source',
                                    // },
                                    {
                                        title: '更新状态',
                                        dataIndex: 'type',
                                        key: 'type',
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
