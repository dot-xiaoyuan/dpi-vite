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
        data,
        xField: "date",
        yField: "value",
        seriesField: "type",
        yAxis: {
            label: {
                formatter: (v: number) => v.toLocaleString(), // 千分位格式化
            },
        },
        lineStyle: ({ type }: { type: string }) => {
            if (type === "register") {
                return { lineDash: [4, 4] };
            }
            return { opacity: 0.5 };
        },
        smooth: true, // 平滑曲线
        autoFit: true,
    };

    return <Line {...config} />;
};

export default TrafficChart;
