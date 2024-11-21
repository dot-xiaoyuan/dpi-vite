import React, {useState} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Tag, Tooltip} from "antd";
import {TerminalIdentification} from "../../../services/apiService.ts";
import {Link} from "react-router-dom";
import {createFromIconfontCN} from "@ant-design/icons";

const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/c/font_4731706_z3gdtn2vd7f.js",
});

interface DataType {
    ip: string;
    username: string | null;
    ttl: number;
    user_agent: string;
    mac: string;
    device: string | null;
    last_seen: string;
}

const Identification: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const fetchData = async (params: {
        current?: number;
        pageSize?: number;
        sortField?: string;
        sortOrder?: string;
    }) => {
        setLoading(true);
        try {
            const {current = 1, pageSize = 15, sortField, sortOrder} = params;
            const response = await TerminalIdentification(current, pageSize, sortField, sortOrder);
            return {
                data: response.results,
                success: true,
                total: response.totalCount,
            };
        } catch (error) {
            return {
                data: [],
                success: false,
                total: 0,
            }
        } finally {
            setLoading(false);
        }
    };

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
                                brand_name: string;
                                domain_name: string;
                                description: string;
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
                                <Tag color="cyan" bordered={false}>{item.brand_name}</Tag>
                            </div>
                        )
                    );
                }
                return <Tag bordered={false}></Tag>;
            },
            width: 200,
        },
        {
            title: "TTL",
            dataIndex: "ttl",
            key: "ttl",
            search: false,
            render: (_, record) => {
                if (record.ttl <= 32) {
                    return <>
                        <Tooltip title="Windows 95/98">
                            <Tag color="green" bordered={false}>{record.ttl}</Tag>
                        </Tooltip>
                    </>;
                } else if (record.ttl <= 64) {
                    return <>
                        <Tooltip title="Windows xp/7、Linux、Mac、Android...">
                            <Tag color="blue" bordered={false}>{record.ttl}</Tag>
                        </Tooltip>
                    </>;
                } else if (record.ttl <= 128) {
                    return <>
                        <Tooltip title="Windows NT/2000/8/10/11">
                            <Tag color="cyan" bordered={false}>{record.ttl}</Tag>
                        </Tooltip>
                    </>;
                } else if (record.ttl >= 254) {
                    return <>
                        <Tooltip title="UNIX(FreeBSD/Solaris)">
                            <Tag color="orange" bordered={false}>{record.ttl}</Tag>
                        </Tooltip>
                    </>;
                } else {
                    return <><Tag/></>;
                }
            },
            width: 150,
        },
        {
            title: "Mac地址",
            dataIndex: "mac",
            key: "mac",
            width: 150,
        },
        {
            title: "最后更新时间",
            dataIndex: "last_seen",
            key: "last_seen",
            valueType: "dateTime",
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
                    state={{ip: record.ip}}
                >
                    详情
                </Link>
            ),
        },
    ];

    return (
        <ProTable<DataType>
            columns={columns}
            request={(params) => {
                const {current, pageSize, sorter} = params;
                const sortField = sorter?.field as string | undefined;
                const sortOrder = sorter?.order === "ascend" ? "asc" : "desc";
                return fetchData({current, pageSize, sortField, sortOrder});
            }}
            rowKey="ip"
            pagination={{
                pageSize: 20,
                showSizeChanger: true,
            }}
            scroll={{y: 500}}
            loading={loading}
            search={false} // 如果不需要搜索栏
        />
    );
};

export default Identification;
