import React from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card, Tag} from "antd";
import dayjs from "dayjs";
import {TerminalUseragentRecord} from "../../../services/apiService";

interface UserAgentRecord {
    ip: string;
    host: string;
    user_agent: string;
    ua: string;
    ua_version: string;
    os: string;
    os_version: string;
    device: string;
    brand: string;
    model: string;
    last_seen: string; // ISO format expected
}

const Useragent: React.FC = () => {

    const columns: ProColumns<UserAgentRecord>[] = [
        {
            title: '集合时间',
            key: 'collection',
            hideInTable: true,
            valueType: 'date',
            width: 100,
        },
        {
            title: "IP",
            dataIndex: "ip",
            width: 150
        },
        {
            title: "访问地址",
            dataIndex: "host",
            width: 200,
            search: false,
            render: (_, record) => (
                <Tag>{record.host}</Tag>
            ),
        },
        {
            title: "User Agent",
            dataIndex: "user_agent",
            search: false,
            width: 200,
            render: (_, record) => (
                <span title={record.user_agent}>{record.user_agent}</span>
            ),
        },
        {
            title: "浏览器名称",
            dataIndex: "ua",
            search: false,
            width: 50,
            render: (_, record) => (
                <Tag>{record.ua}</Tag>
            ),
        },
        {
            title: "浏览器版本",
            dataIndex: "ua_version",
            search: false,
            render: (_, record) => (
                <Tag>{record.ua_version}</Tag>
            ),
        },
        {
            title: "操作系统",
            dataIndex: "os",
            search: false,
            render: (_, record) => (
                <Tag>{record.os}</Tag>
            ),
        },
        {
            title: "操作系统版本",
            dataIndex: "os_version",
            search: false,
            render: (_, record) => (
                <Tag>{record.os_version}</Tag>
            ),
        },
        {
            title: "设备类型",
            dataIndex: "device",
            search: false,
            render: (_, record) => (
                <Tag>{record.device}</Tag>
            ),
        },
        {
            title: "设备品牌",
            dataIndex: "brand",
            search: false,
            render: (_, record) => (
                <Tag>{record.brand}</Tag>
            ),
        },
        {
            title: "设备型号",
            dataIndex: "model",
            search: false,
            render: (_, record) => (
                <Tag>{record.model}</Tag>
            ),
        },
        {
            title: "记录时间",
            dataIndex: "last_seen",
            valueType: "dateTime",
            search: false,
        },
    ];

    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: UserAgentRecord[]; success: boolean; total: number }> => {
        // 构造查询条件
        const conditions: Record<string, any> = {};
        if (!params.collection) {
            params.collection = dayjs();
        }
        // 动态构造条件：根据搜索表单的值
        if (params.ip) {
            conditions.ip = params.ip;
        }
        if (params.host) {
            conditions.host = {$regex: params.host, $options: "i"};
        }
        const conditionString = JSON.stringify(conditions);

        const requestParams = {
            page: params.current,
            pageSize: params.pageSize,
            condition: conditionString,
        };

        const collection = dayjs(params.collection).format("YY_MM_DD") + "_useragent"; // 你可以根据需要动态设置

        console.log("collection", collection);
        const res = await TerminalUseragentRecord(requestParams, collection, conditionString);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
    };

    return (
        <Card>
            <ProTable<UserAgentRecord>
                columns={columns}
                request={fetchData}
                rowKey="ip"
                pagination={{
                    pageSize: 20,
                }}
                search={{
                    filterType: "light",
                }}
                scroll={{x: "max-content"}}
            />
        </Card>
    );
};

export default Useragent;
