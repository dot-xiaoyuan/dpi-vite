import React from "react";
import { Line } from "@ant-design/charts";
import { Empty } from "antd";
import { TrafficChartData } from "../../types/dashboard";

interface TrafficProps {
    data: TrafficChartData[];
}

const TrafficChart: React.FC<TrafficProps> = ({ data }) => {
    if (data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无流量数据" />;
    }

    const config = {
        title: "流量趋势",
        data,
        xField: "date",
        yField: "value",
        colorField: 'type',
        axis: {
            y: {
                labelFormatter: (v: any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        scale: {color: {range: ['#30BF78', '#F4664A', '#FAAD14']}},
        style: {
            lineWidth: 2,
            lineDash: (data: { type: string; }[]) => {
                if (data[0].type === 'register') return [4, 4];
            },
            opacity: (data: { type: string; }[]) => {
                if (data[0].type !== 'register') return 0.5;
            },
        },
    };

    return <Line {...config} />;
};

export default TrafficChart;
