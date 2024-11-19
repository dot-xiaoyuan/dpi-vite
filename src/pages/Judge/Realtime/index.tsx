import React from "react";
import {TerminalApplication} from "../../../services/apiService.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card} from "antd";
import dayjs from "dayjs";
import {DeviceRecord} from "../../../types/terminal.ts";

interface RealtimeProps {
    ip: string;
    username: string;
    devices: DeviceRecord[] | null;
    all_count: number;
    mobile_count: number;
    pc_count: number;
    last_seen: string;
}

const Realtime: React.FC = () => {
    const columns: ProColumns<RealtimeProps>[] = [
        {title: "集合时间", dataIndex: "collection", valueType: 'date', width: 100, hideInTable: true},
        {
            title: "IP",
            dataIndex: "ip",
        },
        {
            title: "用户名",
            dataIndex: "username",
        },
        {
            title: "设备总数",
            dataIndex: "all_count",
            search: false
        },
        {
            title: "Mobile Count",
            dataIndex: "mobile_count",
            search: false
        },
        {
            title: "PC Count",
            dataIndex: "pc_count",
            search: false
        },
        {
            title: "记录时间",
            dataIndex: "last_seen",
            valueType: "dateTime", search: false
        },
    ];

    const deviceColumns: ProColumns<DeviceRecord>[] = [
        {title: "IP", dataIndex: "ip", key: "ip"},
        {title: "OS", dataIndex: "os", key: "os"},
        {title: "Version", dataIndex: "version", key: "version"},
        {title: "Device", dataIndex: "device", key: "device"},
        {title: "Brand", dataIndex: "brand", key: "brand"},
        {title: "Model", dataIndex: "model", key: "model"},
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (_, record) =>
                record.icon ? (
                    <img
                        src={record.icon}
                        alt="device icon"
                        style={{width: 24, height: 24}}
                    />
                ) : (
                    "N/A"
                ),
        },
    ];
    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: RealtimeProps[]; success: boolean; total: number }> => {
        // 构造查询条件
        const conditions: Record<string, any> = {};
        if (!params.collection) {
            params.collection = dayjs();
        }
        const conditionString = JSON.stringify(conditions);

        const requestParams = {
            page: params.current,
            pageSize: params.pageSize,
            condition: conditionString,
        };

        const collection = "stream-" + dayjs(params.collection).format("YY-MM-DD-HH"); // 你可以根据需要动态设置

        const res = await TerminalApplication(requestParams, collection, conditionString);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
    };

    return (
        <Card>
            <ProTable<RealtimeProps>
                columns={columns}
                request={fetchData}
                rowKey="ip"
                pagination={{
                    pageSize: 10,
                }}
                expandable={{
                    expandedRowRender: (record) => (
                        <ProTable<DeviceRecord>
                            columns={deviceColumns}
                            dataSource={record.devices || []}
                            rowKey="ip"
                            pagination={false}
                            search={false}
                            toolBarRender={false}
                        />
                    ),
                }}
                search={{
                    filterType: "light",
                }}
            />
        </Card>
    );
}

export default Realtime;