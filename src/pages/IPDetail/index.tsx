import React, {useEffect, useState} from 'react';
import {Card, Collapse, Descriptions, Empty, message, Spin, Table, Tag} from 'antd';
import {useLocation} from "react-router-dom";
import {createFromIconfontCN} from '@ant-design/icons';
import TTLChart from "../../components/charts/ttl.tsx";
import {TerminalDetail} from "../../services/apiService.ts";
import {DeviceRecord, DeviceRecordLogs} from "../../types/terminal.ts";
import ChartArea from "../../components/charts/area.tsx";

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4731706_ofxem8tqzqi.js',
});

const columns = [
    {title: "IP", dataIndex: "ip", width: '10%', fixed: 'left'},
    {title: "OS", dataIndex: "os", width: '20%'},
    {title: "Version", dataIndex: "version", width: '10%'},
    {title: "Device", dataIndex: "device", width: '10%'},
    {title: "Brand", dataIndex: "brand", width: '10%'},
    {title: "Model", dataIndex: "model", width: '10%'},
];

const logColumns = [
    {title: "IP", dataIndex: "ip", width: '10%', fixed: 'left'},
    {title: "Origin Channel", dataIndex: "origin_chanel", width: '5%'},
    {title: "Origin Value", dataIndex: "origin_value", width: '40%'},
    {title: "OS", dataIndex: "os", width: '5%'},
    {title: "Version", dataIndex: "version", width: '5%'},
    {title: "Device", dataIndex: "device", width: '5%'},
    {title: "Brand", dataIndex: "brand", width: '5%'},
    {title: "Model", dataIndex: "model", width: '5%'},
    {title: "Remark", dataIndex: "remark", width: '10%'},
    {
        title: "Last Seen", dataIndex: "last_seen", render: (text: string | number | Date) => {
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
            children: <Tag color="green">{ip}</Tag>,
        },
        {
            label: 'Mac',
            children: <Tag color="green">{detail?.detail?.mac || "N/A"}</Tag>,
        },
        {
            label: 'TTL',
            children: <Tag color="green">{detail?.detail?.ttl || "N/A"}</Tag>,
        },
        {
            label: 'UserAgent',
            children: <Tag color="green">{detail?.detail?.user_agent || "N/A"}</Tag>,
        },
        {
            label: 'Device',
            children: (() => {
                const device = detail?.detail?.device ? JSON.parse(detail?.detail?.device) : [];
                return device.length > 0 ? (
                    <>
                        {device.map((item: { icon: string }, index: React.Key) => (
                            <IconFont key={index} type={item.icon} style={{fontSize: '30px', marginRight: '8px'}}/>
                        ))}
                    </>
                ) : <Tag color="green">N/A</Tag>;
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
                <Collapse.Panel header="Summary" key="1">
                    <Card bordered={false}>
                        <Descriptions bordered column={{xs: 1, sm: 2, md: 3, lg: 3, xl: 5, xxl: 5}} items={items}/>
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="Device List" key="2">
                    <Card bordered={false}>
                        <Table
                            columns={columns}
                            dataSource={devices.map((item, index) => ({...item, key: index}))}
                            locale={{emptyText: <Empty description="No data"/>}}
                            scroll={{x: 'max-content'}}
                        />
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="Device Logs" key="3">
                    <Card bordered={false}>
                        <Table
                            columns={logColumns}
                            dataSource={devices_logs.map((item, index) => ({...item, key: index}))}
                            locale={{emptyText: <Empty description="No data"/>}}
                            scroll={{x: 'max-content'}}
                        />
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="Traffic Distribution Chart" key="4">
                    <Card bordered={false}>
                        {detail?.features && <ChartArea data={detail.features}/>}
                    </Card>
                </Collapse.Panel>

                <Collapse.Panel header="TTL History Chart" key="5">
                    <Card bordered={false}>
                        {detail?.history?.ttl?.origin_changes && <TTLChart data={detail.history.ttl.origin_changes}/>}
                    </Card>
                </Collapse.Panel>
            </Collapse>
        </Spin>
        // </PageHeaderWrapper>
    );
};

export default IPDetail;
