import type {ProColumns} from '@ant-design/pro-components';
import {EditableProTable,} from '@ant-design/pro-components';
import React, {useState} from 'react';
import {PolicyList, UpdatePolicy} from "../../../services/apiService.ts";
import {Switch, Badge, message} from "antd"

type PolicySourceType = {
    products_id: React.Key;
    products_name: string;
    proxy_disable_time: number;
    proxy_times: number;
    control_name: string;
    disable_proxy: number;
    mgr_name: string;
    all: number;
    mobile: number;
    pc: number;
}

export default () => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<readonly PolicySourceType[]>([]);

    const columns: ProColumns<PolicySourceType>[] = [
        {
            title: '产品ID',
            dataIndex: 'products_id',
            editable: false,
        },
        {
            title: '产品名称',
            dataIndex: 'products_name',
            readonly: true,
        },
        {
            title: '控制策略',
            dataIndex: 'control_name',
            readonly: true,
        },

        {
            title: '代理检测开关',
            dataIndex: 'disable_proxy',
            readonly: true,
            render: (_text, record) => (
                <Switch disabled={true} defaultChecked={record.disable_proxy == 1} />
            )
        },
        {
            title: '检测次数',
            dataIndex: 'proxy_times',
            readonly: true,
            tooltip: "检测到几次之后针对账号进行封禁处理",
            render: (_text, record) => (
                <Badge count={record.proxy_times} />
            )
        },
        {
            title: '封禁时长（秒）',
            dataIndex: 'proxy_disable_time',
            readonly: true,
            tooltip: "封禁时长",
        },
        {
            title: 'ALL',
            key: 'all',
            dataIndex: 'all',
            readonly: true,
        },
        {
            title: 'Mobile',
            key: 'mobile',
            dataIndex: 'mobile',
            valueType: 'digit',
        },
        {
            title: 'PC',
            key: 'pc',
            dataIndex: 'pc',
            valueType: 'digit',
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (_text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.products_id);
                    }}
                >
                    编辑
                </a>,
            ],
        },
    ];

    const fetchData = async (): Promise<{ data: PolicySourceType[]; success: boolean; total: number }> => {
        const res = await PolicyList();
        setDataSource(res)
        return {
            data: res || [],
            success: true,
            total: res.length,
        };
    };

    const handleUpdate = async (rowKey: any, data: any, row: any) => {
        console.log(rowKey, data, row);
        try {
            const res = await UpdatePolicy({
                all: data.all,
                products_id: rowKey,
                pc: data.pc,
                mobile: data.mobile
            });
            // @ts-ignore
            if (res.code == 0) {
                message.success("编辑成功");
            } else {
                // @ts-ignore
                message.error(res.message);
            }
            fetchData()
        } catch (error) {
            message.error('编辑策略失败，请稍后再试！');
            console.error(error);
        }
    };

    return (
        <>
            <EditableProTable<PolicySourceType>
                rowKey="products_id"
                headerTitle="准入策略"
                maxLength={5}
                scroll={{
                    x: 960,
                }}
                loading={false}
                recordCreatorProps={false}
                toolBarRender={() => []}
                columns={columns}
                request={fetchData}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onSave: handleUpdate,
                    actionRender: (_, __, dom) => [dom.save, dom.cancel],
                    onChange: setEditableRowKeys,
                }}
            />
        </>
    );
};