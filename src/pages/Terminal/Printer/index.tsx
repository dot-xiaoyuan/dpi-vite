import React, {useEffect} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {TerminalPrinter} from "../../../services/apiService.ts";
import {Badge} from "antd";

interface DataType {
    mac: string;
    ipv4: string;
    ipv6: string;
    name: string;
    is_active: boolean;
    last_seen: string;
}

const PrinterMacList: React.FC = () => {

    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: DataType[]; success: boolean; total: number }> => {
        // 构造查询条件
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

    // 组件钩子
    useEffect(() => {
        // 获取设备列表
        // 创建websocket
        // const createSocket = () => {
        //     const socket = new WebSocket(baseURLWebsocket + "/printer");
        //     setSocket(socket);
        //
        //     socket.onopen = () => {
        //         console.log("WebSocket connected");
        //     }
        //     socket.onmessage = (event) => {
        //         try {
        //             const newData = JSON.parse(event.data);
        //             console.log(newData);
        //             // 更新或新增设备
        //             setData((prevData) =>
        //                 prevData.map((item) =>
        //                     item.mac === newData.mac ? { ...item, is_active: newData.is_active } : item
        //                 )
        //             );
        //             // 显示通知
        //             if (newData.event == 0 || newData.event == 1) {
        //                 openNotificationWithIcon(
        //                     newData.event === 0 ? 'success' : 'warning',
        //                     `打印机 ${newData.mac} ${newData.event === 0 ? '处于活跃状态':'不再活跃'}`
        //                 );
        //             }
        //         } catch (error) {
        //             console.log(error);
        //         }
        //     }
        //     socket.onerror = (error) => {
        //         console.log(error);
        //         message.error("WebSocket Error");
        //     }
        //     socket.onclose = (event) => {
        //         console.log("WebSocket disconnected with code:", event.code);
        //         if (event.code !== 1000) {
        //             message.warning("WebSocket 连接已关闭");
        //         }
        //     };
        // }
        //
        // createSocket();
        // // 组件卸载时关闭 WebSocket 连接
        // return () => {
        //     if (socket) {
        //         socket.close();
        //     }
        // };
    }, []);
    const columns: ProColumns<DataType>[] = [
        {
            title: "Mac",
            dataIndex: "mac",
            key: "mac",
            width: 150,
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
        },
        {
            title: "设备名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "状态",
            dataIndex: "is_active",
            key: "is_active",
            width: 150,
            render: (_, record) => {
                if (record.is_active) {
                    return <Badge color="cyan"/>
                } else {
                    return <Badge color="red"/>
                }
            }
        },
        {
            title: "发现时间",
            dataIndex: "last_seen",
            key: "last_seen",
            width: 200,
            valueType: "dateTime",
            render: (_, record) => {
                const timestamp = Number(record.last_seen); // 确保是数字类型
                const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp); // 秒级转换为毫秒
                return date.toLocaleString(); // 根据本地时间格式化时间
            },
        },
    ];

    return (
        <>
            <ProTable<DataType>
                columns={columns}
                request={fetchData}
                rowKey="mac"
                search={false}
            />
        </>
    );
}

export default PrinterMacList;