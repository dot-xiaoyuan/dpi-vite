import React, {useEffect, useState} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {message, notification} from "antd";
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
}

const PrinterIPList: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: '提示',
            description:
                '打印机列表已更新',
        });
    };

    // WebSocket连接建立与接收数据
    useEffect(() => {
        // 创建 WebSocket 连接
        const createSocket = () => {
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
                    // Non-1000 codes may indicate an abnormal closure
                    message.warning("WebSocket 连接已关闭，正在尝试重新连接...");
                    setLoading(false);
                    // Try to reconnect after 1 second
                    setTimeout(() => {
                        createSocket(); // Reconnect
                    }, 1000);
                }
            };
        };

        createSocket(); // Initial socket connection

        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

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
