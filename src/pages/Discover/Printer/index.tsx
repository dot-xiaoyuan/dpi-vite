import React, {useEffect} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {TerminalPrinter} from "../../../services/apiService";

interface DataType {
    name: string;
    ipv4: string;
    ipv6: string;
    port: number;
    last_seen: number;
    txt: { [key: string]: any }; // 动态键值对
}

const PrinterList: React.FC = () => {
    const fetchData = async (
        params: Record<string, any>
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

    useEffect(() => {
        // 可添加其他业务逻辑
    }, []);

    const columns: ProColumns<DataType>[] = [
        {
            title: "实例",
            dataIndex: "name",
            key: "name",
            width: 400,
        },
        {
            title: "IPv4",
            dataIndex: "ipv4",
            key: "ipv4",
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
            title: "发现时间",
            dataIndex: "last_seen",
            key: "last_seen",
            width: 200,
            valueType: "dateTime",
            render: (_, record) => {
                const timestamp = Number(record.last_seen);
                // 秒级时间戳转换为毫秒
                const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp);
                return date.toLocaleString();
            },
        },
    ];

    return (
        <ProTable<DataType>
            columns={columns}
            request={fetchData}
            rowKey="name"  // 确保使用唯一的 key，例如 mac 或 uuid
            search={false}
            expandable={{
                // 只有当 txt 存在且有数据时允许展开
                rowExpandable: (record) =>
                    record.txt && Object.keys(record.txt).length > 0,
                expandedRowRender: (record) => (
                    <div style={{ padding: "16px" }}>
                        {Object.entries(record.txt).map(([key, value]) => (
                            <div key={key}>
                                <strong>{key}:</strong> {value || "-"}
                            </div>
                        ))}
                    </div>
                ),
            }}
        />
    );
};

export default PrinterList;
