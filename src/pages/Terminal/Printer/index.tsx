import React, { useCallback, useEffect, useState } from "react";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, notification, Tag } from "antd";
import { baseURLWebsocket } from "../../../services/api.ts";
import { TerminalPrinter } from "../../../services/apiService.ts";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface DataType {
    last_seen?: string;
    mac: string;
    is_active: boolean;
}

const PrinterIPList: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType, message: string) => {
        api[type]({
            message: '提示',
            description: message,
        });
    };

    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: DataType[]; success: boolean; total: number }> => {
        const conditions: Record<string, any> = {};
        const requestParams = {
            page: params.current,
            pageSize: params.pageSize,
            condition: conditions,
        };
        const res = await TerminalPrinter(requestParams);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
    };

    // 创建 WebSocket 连接
    const createSocket = useCallback(() => {
        const socket = new WebSocket(baseURLWebsocket + "/printer");
        setSocket(socket);

        socket.onopen = () => {
            // console.log("WebSocket connected");
            setLoading(false);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data)
                // 判断事件类型
                if (data.event === 0 || data.event === 1) {
                    // 提示活跃或不活跃状态
                    openNotificationWithIcon(data.event === 0 ? 'success' : 'warning', `打印机 ${data.mac} ${data.event === 0 ? '处于活跃状态' : '不再活跃'}`);
                    // 处理活跃/不活跃状态
                    setData((prevData) => {
                        const newData = new Map(prevData.map(device => [device.mac, device]));

                        console.log(newData);
                        if (newData.has(data.mac)) {
                            // 更新现有设备
                            newData.set(data.mac, {
                                mac: data.mac,
                                is_active: data.is_active,
                            });

                        } else {
                            // 添加新设备
                            newData.set(data.mac, {
                                mac: data.mac,
                                is_active: data.is_active
                            });
                        }

                        return Array.from(newData.values());
                    });
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

    // 在组件挂载时调用 createSocket
    useEffect(() => {
        // 获取设备列表
        fetchData({ current: 1, pageSize: 20 }).then((res)=> {
            setData(res.data);
            setLoading(false);
        })
        createSocket(); // 创建 WebSocket 连接

        return () => {
            // 在组件卸载时关闭 WebSocket 连接
            if (socket) {
                socket.close();
            }
        };
    }, [createSocket]);

    // 处理表格数据
    const columns: ProColumns<DataType>[] = [
        {
            title: "Mac地址",
            dataIndex: "mac",
            key: "mac",
            width: 150,
            search: false,
        },
        {
            title: "IPv4",
            dataIndex: "ipv4",
            key: "ipv4",
            width: 150,
        },
        {
            title: "IPv6",
            dataIndex: "ipv6",
            key: "ipv6",
            width: 200,
        },
        {
            title: "设备名称",
            dataIndex: "name",
            key: "name",
            width: 150,
            search: false,
        },
        {
            title: "是否活跃",
            dataIndex: "is_active",
            key: "is_active",
            render: (_, record) => {
                // 如果 timestamp 为 0，返回 "不活跃"
                if (!record.is_active) {
                    return <Tag color="red" bordered={false}>不活跃</Tag>;
                } else {
                    return <Tag color="cyan" bordered={false}>活跃中</Tag>;
                }
            },
            width: 200,
            search: false,
        },
        {
            title: "发现设备时间",
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
    ];

    return (
        <>
            {contextHolder}
            <ProTable<DataType>
                columns={columns}
                request={fetchData}
                rowKey="mac"
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 20,
                }}
                scroll={{ y: 800 }}
                search={false}
                // 使用当前的 data 来渲染表格
                dataSource={data}
                loading={loading}
            />
        </>
    );
};

export default PrinterIPList;
