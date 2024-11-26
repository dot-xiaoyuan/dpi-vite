import React from "react";
import {JudgeSuspected} from "../../../services/apiService.ts";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card, Tag, Tooltip} from "antd";
import dayjs from "dayjs";

interface SuspectedProps {
    _id: string;
    ip: string;
    username: string | null;
    reason_category: string;
    reason_detail: ReasonDetail;
    tags: string[];
    last_seen: string;
}

interface ReasonDetail {
    name: string;
    value: any;
    threshold: number;
    description: string;
}

const Suspected: React.FC = () => {
    // State to manage expanded rows

    const columns: ProColumns<SuspectedProps>[] = [
        {
            title: "集合时间",
            dataIndex: "collection",
            valueType: "dateMonth",
            width: 100,
            hideInTable: true, // 仅用于搜索，不在表格中展示
        },
        {
            title: "记录 ID",
            dataIndex: "_id",
            search: false
        },
        {
            title: "IP 地址",
            dataIndex: "ip",
        },
        {
            title: "疑似原因分类",
            dataIndex: "reason_category",
            render: (_, record) => {
                if (record.reason_category === "protocol_threshold") {
                    return <Tag bordered={false} color="geekblue">协议阈值超限</Tag>;
                }
                return <Tag bordered={false} color="default">其他原因</Tag>;
            },
            search: false
        },
        {
            title: "原因详情",
            dataIndex: "reason_detail",
            render: (_, record) => (
                <>
                    <p>
                        <strong>协议:</strong> {record.reason_detail.name}
                    </p>
                    <p>
                        <strong>值:</strong> {record.reason_detail.value} / <strong>阈值:</strong> {record.reason_detail.threshold}
                    </p>
                    <p>
                        <strong>描述:</strong> {record.reason_detail.description}
                    </p>
                </>
            ),
            search: false
        },
        {
            title: "说明",
            dataIndex: "tags",
            render: (_, record) => (
                <Tooltip
                    title={
                        record.tags.map((item: string, index: number) => (
                            <div key={index} style={{marginBottom: 4}}>
                                {item}
                            </div>
                        ))
                    }
                >
                    <span>查看</span>
                </Tooltip>
            ),
            search: false
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
    ): Promise<{ data: SuspectedProps[]; success: boolean; total: number }> => {
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

        const res = await JudgeSuspected(requestParams, collection, conditionString);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
    };

    return (
        <Card>
            <ProTable<SuspectedProps>
                columns={columns}
                request={fetchData}
                rowKey="_id"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 10,
                }}
                search={{filterType: "light"}}
            />
        </Card>
    );
}

export default Suspected;
