import React, {useEffect, useState} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Badge,notification, message, Space, Tag, Tooltip} from "antd";
import {Link} from "react-router-dom";
import {createFromIconfontCN} from "@ant-design/icons";
import {baseURLWebsocket} from "../../../services/api.ts";

const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4731706_z3gdtn2vd7f.js",
});
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

const ActiveIPList: React.FC = () => {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type: NotificationType) => {
        api[type]({
            message: '提示',
            description:
                '活跃设备列表已更新',
        });
    };

    // WebSocket连接建立与接收数据
    useEffect(() => {
        // 创建 WebSocket 连接
        const createSocket = () => {
            const socket = new WebSocket(baseURLWebsocket + "/active");
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
                    message.warning("WebSocket 连接已关闭");
                    setLoading(false);
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
            title: "用户名",
            dataIndex: "username",
            key: "username",
            width: 150,
            search: false,
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
            title: "设备",
            dataIndex: "device",
            key: "device",
            search: false,
            render: (_, record) => {
                const devices = record.device ? JSON.parse(record.device) : [];
                if (devices.length > 0) {
                    return devices.map(
                        (
                            item: {
                                icon: string;
                                brand: string;
                            },
                            index: React.Key
                        ) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                }}
                            >
                                <IconFont
                                    type={item.icon || "default-icon"}
                                    style={{fontSize: "32px", marginRight: "8px"}}
                                />
                                <Tag color="cyan" bordered={false}>{item.brand}</Tag>
                            </div>
                        )
                    );
                }
                return <Tag bordered={false}></Tag>;
            },
            width: 200,
        },
        {
            title: "设备数量",
            dataIndex: "device_count",
            key: "device_count",
            search: false,
            render: (_, record) => (
                <Space size={16} wrap>
                    <Tooltip title="设备总数">
                        <Badge count={record.all ?? 0}>
                            <Tag bordered={false} color="red">
                                ALL
                            </Tag>
                        </Badge>
                    </Tooltip>
                    <Tooltip title="移动端设备数">
                        <Badge count={record.mobile ?? 0}>
                            <Tag bordered={false} color="cyan">
                                Mobile
                            </Tag>
                        </Badge>
                    </Tooltip>
                    <Tooltip title="桌面设备数">
                        <Badge count={record.pc ?? 0}>
                            <Tag bordered={false} color="orange">
                                PC
                            </Tag>
                        </Badge>
                    </Tooltip>
                </Space>
            ),
            width: 200,
        },
        {
            title: "TTL",
            dataIndex: "ttl",
            key: "ttl",
            search: false,
            render: (_, record) => {
                if (record.ttl <= 32) {
                    return (
                        <Tooltip title="Windows 95/98">
                            <Tag color="green" bordered={false}>
                                {record.ttl}
                            </Tag>
                        </Tooltip>
                    );
                } else if (record.ttl <= 64) {
                    return (
                        <Tooltip title="Windows xp/7、Linux、Mac、Android...">
                            <Tag color="blue" bordered={false}>
                                {record.ttl}
                            </Tag>
                        </Tooltip>
                    );
                } else if (record.ttl <= 128) {
                    return (
                        <Tooltip title="Windows NT/2000/8/10/11">
                            <Tag color="cyan" bordered={false}>
                                {record.ttl}
                            </Tag>
                        </Tooltip>
                    );
                } else if (record.ttl >= 254) {
                    return (
                        <Tooltip title="UNIX(FreeBSD/Solaris)">
                            <Tag color="orange" bordered={false}>
                                {record.ttl}
                            </Tag>
                        </Tooltip>
                    );
                } else {
                    return <Tag />;
                }
            },
            width: 150,
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
        />
            </>
    );
};

export default ActiveIPList;
