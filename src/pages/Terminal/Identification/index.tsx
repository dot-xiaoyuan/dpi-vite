import React, {useState} from "react";
import {ProColumns, ProTable} from "@ant-design/pro-components";
import {Badge, Input, Select, Space, Tag, Tooltip} from "antd";
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
    device_name: string | null;
    device_type: string | null;
    all: string | null;
    mobile: string | null;
    pc: string | null;
    last_seen: string;
}

const Identification: React.FC = () => {
    // const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [inputValue, setInputValue] = useState("");


    const fetchData = async (
        params: Record<string, any>,
    ): Promise<{ data: DataType[]; success: boolean; total: number }> => {
        // setLoading(true);
        // 构造查询条件
        const conditions: Record<string, any> = {};
        // 动态构造条件：根据搜索表单的值
        if (params.ip) {
            conditions.ip = params.ip;
        }
        if (params.host) {
            conditions.host = {$regex: params.host, $options: "i"};
        }
        // 动态添加筛选条件
        if (filterType && inputValue) {
            switch (filterType) {
                case "all":
                    conditions.devices_count_all = inputValue;
                    break;
                case "pc":
                    conditions.devices_count_pc = inputValue;
                    break;
                case "mobile":
                    conditions.devices_count_mobile = inputValue;
                    break;
                default:
                    break;
            }
        }

        const requestParams = {
            page: params.current,
            pageSize: params.pageSize,
            condition: conditions,
        };

        const res = await TerminalIdentification(requestParams);
        return {
            data: res.result || [],
            success: true,
            total: res.total_count || 0,
        };
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
            search: false
        },
        {
            title: "设备类型",
            dataIndex: "device_type",
            key: "device_type",
            width: 150,
            search: false
        },
        {
            title: "设备名称",
            dataIndex: "device_name",
            key: "device_name",
            width: 150,
            search: false
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
            render: (_, record) => {
                return <>
                    <Space size={16} wrap>
                        <Tooltip title="设备总数">
                            <Badge count={record.all ?? 0}>
                                <Tag bordered={false} color="red">ALL</Tag>
                            </Badge>
                        </Tooltip>
                        <Tooltip title="移动端设备数">
                            <Badge count={record.mobile ?? 0}>
                                <Tag bordered={false} color="cyan">Mobile</Tag>
                            </Badge>
                        </Tooltip>
                        <Tooltip title="桌面设备数">
                            <Badge count={record.pc ?? 0}>
                                <Tag bordered={false} color="orange">PC</Tag>
                            </Badge>
                        </Tooltip>
                    </Space>

                </>
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
            search: false
        },
        {
            title: "最后更新时间",
            dataIndex: "last_seen",
            key: "last_seen",
            valueType: "dateTime",
            render: (_, record) => {
                const timestamp = Number(record.last_seen); // 确保是数字类型
                if (timestamp > 1000) {
                    const date = new Date(timestamp < 1e12 ? timestamp * 1000 : timestamp); // 秒级转换为毫秒
                    return date.toLocaleString(); // 根据本地时间格式化时间
                }
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
            request={fetchData}
            rowKey="ip"
            pagination={{
                showSizeChanger: true,
                defaultPageSize: 20,
            }}
            scroll={{y: 800}}
            toolbar={{
                search: (
                    <>
                        {/* 下拉框用于选择筛选的设备类型 */}
                        <Select
                            value={filterType}
                            onChange={(value) => {
                                setFilterType(value);
                                setInputValue(""); // 清空输入框
                            }}
                            style={{ width: 120, marginRight: 10 }}
                        >
                            <Select.Option value="all">总数</Select.Option>
                            <Select.Option value="pc">PC</Select.Option>
                            <Select.Option value="mobile">移动端</Select.Option>
                        </Select>
                        {/* 输入框用于输入筛选值 */}
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="输入筛选值"
                            style={{ width: 150 }}
                        />
                    </>
                ),
            }}
            // loading={loading}
            // search={false} // 如果不需要搜索栏
        />
    );
};

export default Identification;
