import React from "react";
import {JudgeRealtime} from "../../../services/apiService.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import { Link } from "react-router-dom";

interface RealtimeProps {
    ip: string;
    username: string;
    last_seen: string;
}

const RealTimeShared: React.FC = () => {

    const columns: ProColumns<RealtimeProps>[] = [
        {title: "集合时间", dataIndex: "collection", valueType: 'dateMonth', width: 100, hideInTable: true},
        {title: "IP", dataIndex: "ip"},
        {title: "用户名", dataIndex: "username"},
        {
            title: "最后更新时间",
            dataIndex: "last_seen",
            key: "last_seen",
            valueType: "dateTime",
            render: (_, record) => {
                const timestamp = Number(record.last_seen); // 确保是数字类型
                const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp); // 秒级转换为毫秒
                return date.toLocaleString(); // 根据本地时间格式化时间
            },
            search: false,
        },
        {
            title: "操作",
            key: "operation",
            fixed: "right",
            search: false,
            render: (_, record) => (
                <Link
                    to={{
                        pathname: "/terminal/ip-detail",
                    }}
                    state={{ip: record.ip}}
                >
                    详情
                </Link>
            ),
        },
    ];

    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: RealtimeProps[]; success: boolean; total: number }> => {
        const conditions: Record<string, any> = {};
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

        const res = await JudgeRealtime(requestParams);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
    };

    return (
        <ProTable<RealtimeProps>
            columns={columns}
            request={fetchData}
            rowKey="ip"
            pagination={{
                showSizeChanger: true,
                defaultPageSize: 20,
            }}
            search={false}
            scroll={{x: "max-content"}}
        />
    );
}

export default RealTimeShared;
