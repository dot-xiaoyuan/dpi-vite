import React from "react";
import {JudgeRealtime} from "../../../services/apiService.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card} from "antd";
import dayjs from "dayjs";
import {DeviceRecord} from "../../../types/terminal.ts";
import {createFromIconfontCN} from "@ant-design/icons";

const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4731706_ofxem8tqzqi.js",
});
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
        {title: "系统", dataIndex: "os", key: "os"},
        {title: "版本", dataIndex: "version", key: "version"},
        {title: "设备", dataIndex: "device", key: "device"},
        {title: "品牌", dataIndex: "brand", key: "brand"},
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

        const collection = dayjs(params.collection).format("YY_MM"); // 你可以根据需要动态设置

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