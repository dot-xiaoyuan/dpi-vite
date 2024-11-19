import React from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card, Tag} from "antd";
import {TerminalApplication} from "../../../services/apiService.ts";
import dayjs from "dayjs";

interface Sessions {
    id: string;
    ident: string;
    session_id: string;
    src_ip: string;
    dst_ip: string;
    src_port: string;
    dst_port: string;
    protocol: string;
    packet_count: number;
    byte_count: number;
    miss_bytes: number;
    out_of_order_packets: number;
    out_of_order_bytes: number;
    overlap_bytes: number;
    overlap_packets: number;
    start_time: string; // ISO format expected
    end_time: string; // ISO format expected
    protocol_flags: string; // Custom render logic can be added if needed
    application_protocol: string;
    metadata: Record<string, any>; // Adjust this as per Metadata structure
    custom_fields: Record<string, any>; // Adjust this as per CustomFields structure
}

const Application: React.FC = () => {
    const columns: ProColumns<Sessions>[] = [
        {title: "集合时间", dataIndex: "collection", valueType:'dateTime', width: 100, hideInTable: true},
        {title: "会话ID", dataIndex: "session_id", width: 200, search: false},
        {title: "源IP", dataIndex: "src_ip", width: 150},
        {title: "目标IP", dataIndex: "dst_ip", width: 150},
        {title: "端口", dataIndex: "src_port", width: 200, search: false, render: (_, record) => `${record.src_port} -> ${record.dst_port}`,},
        {title: "源端口", dataIndex: "src_port", width: 200, hideInTable: true},
        {title: "目标端口", dataIndex: "dst_port", width: 200, hideInTable: true},
        // {title: "协议", dataIndex: "protocol", width: 100, search: false},
        {title: "包数", dataIndex: "packet_count", valueType: "digit", search: false},
        {title: "字节数", dataIndex: "byte_count", valueType: "digit", search: false},
        {
            title: "应用", dataIndex: "app_info", render: (_, record) => (
                record.metadata.application_info.app_name && <Tag color="cyan">{record.metadata.application_info.app_name}</Tag>
            ), width: 200, search: false
        },
        {
            title: "应用类别", dataIndex: "app_category", render: (_, record) => (
                record.metadata.application_info.app_category && record.metadata.application_info.app_category != "unknown" && <Tag color="cyan-inverse">{record.metadata.application_info.app_category}</Tag>
            ), width: 200, search: false
        },
        { title: "http_host", dataIndex: "http_info", search: false, render: (_, record) => record.metadata.http_info.host },
        {
            title: "tls_sni", dataIndex: "tls_info", width: '20%', search: false,
            render: (_, record) => (
                <span>
                {record.metadata.tls_info.sni && <Tag color="green">{record.metadata.tls_info.sni}</Tag>}
                    {record.metadata.tls_info.version && <Tag color="blue">{record.metadata.tls_info.version}</Tag>}
            </span>
            ),
        },
        {
            title: "开始时间",
            dataIndex: "start_time",
            valueType: "dateTime", search: false
        },
        {
            title: "结束时间",
            dataIndex: "end_time",
            valueType: "dateTime", search: false
        },
    ];

    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: Sessions[]; success: boolean; total: number }> => {
        // 构造查询条件
        const conditions: Record<string, any> = {};
        if (!params.collection) {
            params.collection = dayjs();
        }
        // 动态构造条件：根据搜索表单的值
        if (params.src_ip) {
            conditions.src_ip = params.src_ip;
        }
        if (params.dst_ip) {
            conditions.dst_ip = params.dst_ip;
        }
        if (params.src_port) {
            conditions.src_port = params.src_port;
        }
        if (params.dst_port) {
            conditions.dst_port = params.dst_port;
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
            <ProTable<Sessions>
                columns={columns}
                request={fetchData}
                rowKey="id"
                pagination={{pageSize: 20}}
                // search={{
                //     // 支持的搜索字段
                //     defaultCollapsed: false,
                //     labelWidth: "auto",
                // }}
                search={{
                    filterType: "light",
                }}
                scroll={{x: "max-content"}}
            />
        </Card>
    );
};

export default Application;
