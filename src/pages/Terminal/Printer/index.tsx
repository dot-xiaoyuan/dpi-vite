import React, {useCallback, useEffect, useState} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {message, notification, Tag} from "antd";
import {Link} from "react-router-dom";
import {baseURLWebsocket} from "../../../services/api.ts";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface DataType {
    ip: string;
    username: string | null;
    ttl: number;
    user_agent: string;
    mac: string;
    device: string | null;
    device_name: string | null;
    device_type: string | null;
    all: string | null;
    mobile: string | null;
    pc: string | null;
    last_seen: string;
    active_time: string;
}

const PrinterIPList: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: '提示',
            description: '打印机列表已更新',
        });
    };

    // 创建 WebSocket 连接
    const createSocket = useCallback(() => {
        const socket = new WebSocket(baseURLWebsocket + "/printer");
        setSocket(socket);

        socket.onopen = () => {
            console.log("WebSocket connected");
            setLoading(false);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.result && Array.isArray(data.result)) {
                    openNotificationWithIcon('success');
                    setData(data.result);
                } else if (data.message === "finished") {
                    console.log("WebSocket connection closed by server: finished");
                    socket.close(); // Gracefully close the connection if "finished" is received
                }
            } catch (error) {
                console.error("Error parsing WebSocket message", error);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
            message.error("WebSocket 连接失败");
            setLoading(false);
        };

        socket.onclose = (event) => {
            console.log("WebSocket disconnected with code:", event.code);
            if (event.code !== 1000) {
                message.warning("WebSocket 连接已关闭");
                setLoading(false);
            }
        };
    }, []);

    useEffect(() => {
        createSocket(); // 初始连接

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [createSocket]); // 只在 createSocket 变化时重新建立连接

    // 处理表格数据
    const columns: ProColumns<DataType>[] = [
        {
            title: "IP",
            dataIndex: "ip",
            key: "ip",
            width: 150,
        },
        {
            title: "设备类型",
            dataIndex: "device_type",
            key: "device_type",
            width: 150,
            search: false,
        },
        {
            title: "设备名称",
            dataIndex: "device_name",
            key: "device_name",
            width: 150,
            search: false,
        },
        {
            title: "Mac地址",
            dataIndex: "mac",
            key: "mac",
            width: 150,
            search: false,
        },
        {
            title: "活跃状态",
            dataIndex: "active_time",
            key: "active_time",
            valueType: "dateTime",
            render: (_, record) => {
                const timestamp = Number(record.active_time);

                // 如果 timestamp 为 0，返回 "不活跃"
                if (timestamp === 0) {
                    return <Tag color="red" bordered={false}>不活跃</Tag>;
                }

                // 否则格式化时间
                const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
                return date.toLocaleString();
            },
            width: 200,
            search: false,
        },
        {
            title: "最后更新时间",
            dataIndex: "last_seen",
            key: "last_seen",
            valueType: "dateTime",
            render: (_, record) => {
                const timestamp = Number(record.last_seen);
                const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
                return date.toLocaleString();
            },
            width: 200,
            search: false,
        },
        {
            title: "操作",
            key: "operation",
            fixed: "right",
            width: 120,
            search: false,
            render: (_, record) => (
                <Link
                    to={{
                        pathname: "/terminal/ip-detail",
                    }}
                    state={{ ip: record.ip }}
                >
                    详情
                </Link>
            ),
        },
    ];

    return (
        <>
            {contextHolder}
            <ProTable<DataType>
                columns={columns}
                dataSource={data}
                rowKey="ip"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 20,
                }}
                scroll={{ y: 800 }}
                loading={loading}
                search={false}
            />
        </>
    );
};

export default PrinterIPList;
