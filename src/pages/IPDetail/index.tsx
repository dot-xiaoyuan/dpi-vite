import React, {useEffect, useState} from 'react';
import {Card, Collapse, Descriptions, Empty, message, Spin, Table, TableProps, Tag, Tooltip} from 'antd';
import {useLocation} from "react-router-dom";
import {createFromIconfontCN} from '@ant-design/icons';
import TTLChart from "../../components/charts/ttl.tsx";
import {TerminalDetail} from "../../services/apiService.ts";
import {DeviceRecord, DeviceRecordLogs} from "../../types/terminal.ts";
import ChartArea from "../../components/charts/area.tsx";

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4731706_z3gdtn2vd7f.js',
});

const columns: TableProps<DeviceRecord>['columns'] = [
    {
        title: "IP",
        dataIndex: "ip",
        width: '10%',
        fixed: 'left'
    },
    {
        title: "系统",
        dataIndex: "os",
        width: '20%',
        render: (_, record) => (
            <Tag bordered={false}>{record.os}</Tag>
        ),
    },
    {
        title: "版本",
        dataIndex: "version",
        width: '10%',
        render: (_, record) => (
            <Tag bordered={false}>{record.version}</Tag>
        ),
    },
    {

        title: "设备",
        dataIndex: "device",
        width: '10%',
        render: (_, record) => (
            <Tag bordered={false}>{record.device}</Tag>
        ),
    },
    {
        title: "品牌",
        dataIndex: "brand",
        width: '10%',
        render: (_, record) => (
            <Tag bordered={false}>{record.brand}</Tag>
        ),
    },
    {
        title: "型号",
        dataIndex: "model",
        width: '10%',
        render: (_, record) => (
            <Tag bordered={false}>{record.model}</Tag>
        ),
    },
];

const logColumns: TableProps<DeviceRecordLogs>['columns'] = [
    {title: "IP", dataIndex: "ip", width: '10%', fixed: 'left'},
    {
        title: "来源", dataIndex: "origin_chanel", width: '5%', render: (_, record) => (
            <Tag bordered={false} color={record.origin_chanel === 'device' ? 'blue' : 'green'}>
                {record.origin_chanel}
            </Tag>
        )
    },
    {
        title: "源值", dataIndex: "origin_value", render: (_, record) => (
            <Tooltip title={record.origin_value}>{record.origin_value.substring(0, 50)}</Tooltip>
        )
    },
    {
        title: "系统", dataIndex: "os", width: '5%', render: (_, record) => (
            <Tag bordered={false}>{record.os}</Tag>
        )
    },
    {
        title: "版本", dataIndex: "version", width: '5%', render: (_, record) => (
            <Tag bordered={false}> {record.version}</Tag>
        )
    },
    {
        title: "设备", dataIndex: "device", width: '5%', render: (_, record) => (
            <Tag bordered={false}>{record.device}</Tag>
        )
    },
    {
        title: "品牌", dataIndex: "brand", width: '5%', render: (_, record) => (
            <Tag bordered={false}>{record.brand}</Tag>
        )
    },
    {
        title: "型号", dataIndex: "model", width: '5%', render: (_, record) => (
            <Tag bordered={false}>{record.model}</Tag>
        )
    },
    {
        title: "备注", dataIndex: "remark", width: '10%', render: (_, record) => (
            <Tag bordered={false}
                 color={record.remark == "saved device" ? "blue" : "green"}>{record.remark == "saved device" ? "保存设备信息" : "更新设备信息"}</Tag>
        )
    },
    {
        title: "录入时间 ", dataIndex: "last_seen", render: (text: string | number | Date) => {
            const date = new Date(text);
            return date.toLocaleString();
        }, width: '20%',
    },
];

const IPDetail: React.FC = () => {
    const location = useLocation();
    const {ip} = location.state || {};
    const [loading, setLoading] = useState(false);
    const [detail, setDetail] = useState<any>(null);
    const [devices, setDevices] = useState<DeviceRecord[]>([]);
    const [devices_logs, setDevicesLogs] = useState<DeviceRecordLogs[]>([]);

    const getData = async () => {
        setLoading(true);
        try {
            const res = await TerminalDetail(ip);
            setDetail(res);
            setDevices(res.devices || []);
            setDevicesLogs(res.devices_logs || []);
        } catch (error) {
            message.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const items = [
        {
            label: 'IP',
            children: <Tag color="cyan">{ip}</Tag>,
        },
        {
            label: 'Mac',
            children: <Tag color="cyan">{detail?.detail?.mac || "N/A"}</Tag>,
        },
        {
            label: 'TTL',
            children: <Tag color="cyan">{detail?.detail?.ttl || "N/A"}</Tag>,
        },
        {
            label: 'UserAgent',
            children: <Tag color="cyan">{detail?.detail?.user_agent || "N/A"}</Tag>,
        },
        {
            label: 'Device',
            children: (() => {
                return devices.length > 0 ? (
                    <>
                        {devices.map((item: DeviceRecord, index: React.Key) => (
                            item.icon ? ( // 确保 icon 存在才渲染 IconFont
                                <IconFont
                                    key={index}
                                    type={item.icon}
                                    style={{ fontSize: '30px', marginRight: '8px' }}
                                />
                            ) : null // 如果没有 icon，可以选择不渲染或渲染占位符
                        ))}
                    </>
                ) : (
                    <Tag color="green">N/A</Tag> // 如果 devices 为空，显示占位内容
                );

            })(),
        },
    ];

    useEffect(() => {
        getData();
    }, []);

    return (
        // <PageHeaderWrapper title={`IP Details: ${ip}`}>
        <Spin spinning={loading}>
            <Collapse defaultActiveKey={['1', '2', '3', '4', '5']} ghost>
                <Collapse.Panel header="摘要" key="1">
                    <Card bordered={false}>
                        <Descriptions bordered column={{xs: 1, sm: 2, md: 3, lg: 3, xl: 5, xxl: 5}} items={items}/>
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="设备列表" key="2">
                    <Card bordered={false}>
                        <Table
                            columns={columns}
                            dataSource={devices.map((item, index) => ({...item, key: index}))}
                            locale={{emptyText: <Empty description="No data"/>}}
                            scroll={{x: 'max-content'}}
                        />
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="设备录入记录" key="3">
                    <Card bordered={false}>
                        <Table
                            columns={logColumns}
                            dataSource={devices_logs.map((item, index) => ({...item, key: index}))}
                            locale={{emptyText: <Empty description="No data"/>}}
                            scroll={{x: 'max-content'}}
                        />
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="流量分布图表" key="4">
                    <Card bordered={false}>
                        <ChartArea data={detail?.features ? detail.features : []}/>
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="TTL 历史变更图表" key="5">
                    <Card bordered={false}>
                        <TTLChart data={detail?.history.ttl?.origin_changes ? detail.history.ttl.origin_changes : []}/>
                    </Card>
                </Collapse.Panel>
            </Collapse>
        </Spin>
        // </PageHeaderWrapper>
    );
};

export default IPDetail;
