import {ProCard, StatisticCard} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import React, {useEffect, useState} from 'react';
import {dashboard} from "../../services/authService.ts";
import Traffic from "../../components/charts/traffic.tsx";
import {TrafficChartData} from "../../types/dashboard.ts";
import ProtocolLayerChart from "../../components/charts/protocolLayer.tsx";
import AppCategoryChart from "../../components/charts/AppCategory.tsx";

type TotalProps = {
    sessions: number
    packets: number
    traffics: number
    users: number
}

type ChartData = {
    app_category: { type: string; value: number }[];
    application: { type: string; value: number }[];
    protocol: { type: string; value: number }[];
    traffic: TrafficChartData[];
};

const Dashboard: React.FC = () => {
    const [responsive, setResponsive] = useState(false);
    const [total, setTotal] = useState<TotalProps>({
        sessions: 0,
        packets: 0,
        traffics: 0,
        users: 0,
    });
    const [charts, setCharts] = useState<ChartData>();

    useEffect(() => {
        dashboard().then((res) => {
            setTotal(res.data.total);
            setCharts(res.data.charts);
        })
    }, []);
    return (
        <RcResizeObserver
            key="resize-observer"
            onResize={(offset) => {
                setResponsive(offset.width < 596);
            }}
        >
            <ProCard
                title="数据概览"
                extra=""
                split={responsive ? 'horizontal' : 'vertical'}
                headerBordered
                bordered
            >
                <ProCard split="horizontal">
                    <ProCard split="horizontal">
                        <ProCard split="vertical">
                            <StatisticCard
                                statistic={{
                                    title: '在线数',
                                    value: total.users,

                                }}
                            />
                            <StatisticCard
                                statistic={{
                                    title: '总流量',
                                    value: total.traffics,
                                }}
                            />
                        </ProCard>
                        <ProCard split="vertical">
                            <StatisticCard
                                statistic={{
                                    title: '总会话数',
                                    value: total.sessions,
                                }}
                            />
                            <StatisticCard
                                statistic={{
                                    title: '总包数',
                                    value: total.packets,
                                }}
                            />
                        </ProCard>
                    </ProCard>
                    <ProCard split="horizontal">
                        <ProCard split="vertical">
                            <StatisticCard
                                title="应用分类占比"
                                chart={<AppCategoryChart data={charts?.app_category ?? []}/>}
                            />
                            <StatisticCard
                                title="协议使用情况"
                                chart={<ProtocolLayerChart data={charts?.protocol ?? []}/>}
                            />
                        </ProCard>
                    </ProCard>
                </ProCard>
                <StatisticCard
                    title="流量变化趋势"
                    chart={<Traffic data={charts?.traffic ?? []}/>}
                />

            </ProCard>
        </RcResizeObserver>
    );
};

export default Dashboard;