import React, {useState} from "react";
import {JudgeRealtime} from "../../../services/apiService.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card, Badge, Tag} from "antd";
import dayjs from "dayjs";
import {DeviceRecord} from "../../../types/terminal.ts";
import {createFromIconfontCN} from "@ant-design/icons";

const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4731706_z3gdtn2vd7f.js",
});

interface RealtimeProps {
    _id: string;
    ip: string;
    username: string;
    devices: DeviceRecord[] | null;
    all_count: number;
    mobile_count: number;
    pc_count: number;
    last_seen: string;
}

const RealTimeShared: React.FC = () => {
    // State to manage expanded rows
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

    const columns: ProColumns<RealtimeProps>[] = [
        {title: "集合时间", dataIndex: "collection", valueType: 'dateMonth', width: 100, hideInTable: true},
        {title: "IP", dataIndex: "ip"},
        {title: "用户名", dataIndex: "username"},
        {
            title: "设备总数", dataIndex: "all_count", search: false, render: (_, record) => {
                return <Badge count={record.all_count ? record.all_count : 0} showZero></Badge>
            }
        },
        {
            title: "Mobile Count", dataIndex: "mobile_count", search: false, render: (_, record) => {
                return <Badge count={record.mobile_count ? record.mobile_count : 0} showZero color="geekblue"></Badge>
            }
        },
        {
            title: "PC Count", dataIndex: "pc_count", search: false, render: (_, record) => {
                return <Badge count={record.pc_count ? record.pc_count : 0} showZero color="gold"></Badge>
            }
        },
        {title: "记录时间", dataIndex: "last_seen", valueType: "dateTime", search: false},
    ];

    const deviceColumns: ProColumns<DeviceRecord>[] = [
        {title: "系统", dataIndex: "os", key: "os"},
        {title: "版本", dataIndex: "version", key: "version"},
        {title: "设备", dataIndex: "device", key: "device"},
        {title: "品牌", dataIndex: "brand", key: "brand", render: (_, record) => {
            return <Tag bordered={false}>{record.brand}</Tag>
            }},
        {title: "型号", dataIndex: "model", key: "model"},
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (_, record) =>
                record.icon ? (
                    <IconFont
                        type={record.icon || "default-icon"}
                        style={{fontSize: "24px", marginRight: "8px"}}
                    />
                ) : (
                    "N/A"
                ),
        },
    ];

    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: RealtimeProps[]; success: boolean; total: number }> => {
        const conditions: Record<string, any> = {};
        if (!params.collection) {
            params.collection = dayjs();
        }
        if (params.ip) {
            conditions.ip = params.ip;
        }
        if (params.username) {
            conditions.username = params.username;
        }
        const conditionString = JSON.stringify(conditions);

        const requestParams = {
            page: params.current,
            pageSize: params.pageSize,
            condition: conditionString,
        };

        const collection = dayjs(params.collection).format("YY_MM");

        const res = await JudgeRealtime(requestParams, collection, conditionString);
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
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 10,
                }}
                expandable={{
                    expandedRowKeys, // Controlled expanded keys
                    onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]), // Update state on change
                    expandedRowRender: (record) => (
                        <ProTable<DeviceRecord>
                            columns={deviceColumns}
                            dataSource={record.devices || []}
                            rowKey={(row) => `${record.ip}-${row.device}`} // Ensure unique keys
                            pagination={false}
                            search={false}
                            toolBarRender={false}
                        />
                    ),
                }}
                search={{filterType: "light"}}
            />
        </Card>
    );
}

export default RealTimeShared;
