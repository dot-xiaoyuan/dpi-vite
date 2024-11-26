import React from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Card, Tag} from "antd";
import dayjs from "dayjs";
import {UserEventsLog} from "../../../services/apiService.ts";


interface UserEventsLogProps {
    _id: string,
    action: number,
    session_id: string,
    nas_ip: string,
    user_name: string,
    ip: string,
    ip6: string,
    user_mac: string | null,
    nas_port: number,
    vlan_id: number,
    bandwidth_up: number,
    bandwidth_down: number,
    products_id: number,
    billing_id: number,
    control_id: number,
    group_id: number,
    rad_online_id: number,
    disable_proxy: number,
    domain: string,
    os_name: string,
    class_name: string,
    mobile_phone: string,
    mobile_password: string,
    is_arrears: number,
    bytes_in: number,
    bytes_out: number,
    add_time: number,
    my_ip: string | null,
    drop_cause: number,
    user_debug: number,
    line_type: number,
    ac_type: string,
    sum_times: number,
    sum_bytes: number,
    sum_seconds: number,
    all_bytes: number,
    all_seconds: number,
    user_balance: number,
    user_charge: number,
    cur_charge: number,
    drop_reason: number,
    drop_time: number,
    dest_control: number,
    proc: string
}

const UserEvents: React.FC = () => {
    // State to manage expanded rows

    const columns: ProColumns<UserEventsLogProps>[] = [
        {title: "集合时间", dataIndex: "collection", valueType: 'dateMonth', width: 100, hideInTable: true},
        {
            title: "记录ID",
            dataIndex: "_id",
            width: '10%',
        },
        {
            title: "事件类型",
            dataIndex: "action",
            render: (_, record) => (
                <span>
                {record.action == 1 ? <Tag color="green" bordered={false}>上线</Tag> : <Tag color="red" bordered={false}>下线</Tag>}
            </span>
            ),
            width: '10%',
        },
        {
            title: "用户名",
            dataIndex: "user_name",
            render: (_, record) => `${record.user_name}`,
            width: '10%',
        },
        {
            title: "IP",
            dataIndex: "IP",
            render: (_, record) => `${record.ip}`,
            width: '10%',
        },
        // {
        //     title: "ProductID",
        //     dataIndex: "products_id",
        //     render: (_, record) => `${record.products_id}`,
        //     width: '10%',
        // },
        // {
        //     title: "ControlID",
        //     dataIndex: "contract_id",
        //     render: (_, record) => `${record.control_id}`,
        //     width: '10%',
        // },
        // {
        //     title: "LineType",
        //     dataIndex: "line_type",
        //     render: (_, record) => `${record.line_type}`,
        //     width: '10%',
        // },
        {
            title: "Mac地址",
            dataIndex: "user_mac",
            render: (_, record) => `${record.user_mac}`,
            width: '10%',
        },
        {
            title: "事件时间",
            dataIndex: "add_time",
            render: (_, record) => {
                const timestamp = Number(record.add_time); // 确保是数字类型
                const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp); // 秒级转换为毫秒
                return date.toLocaleTimeString(); // 根据本地时间格式化时间
            },
            width: '10%',
        },
    ];


    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: UserEventsLogProps[]; success: boolean; total: number }> => {
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

        const res = await UserEventsLog(requestParams, collection, conditionString);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
    };

    return (
        <Card>
            <ProTable<UserEventsLogProps>
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

export default UserEvents;
