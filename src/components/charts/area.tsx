import {Area} from "@ant-design/charts";
import React from "react";
import { Empty } from "antd";
import {AreaChartData} from "../../types/area.tsx";

interface AreaProps {
    data: AreaChartData[];
}
const ChartArea: React.FC<AreaProps> = ({data}) => {
    if (data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无数据" />;
    }
    const config = {
        data,
        xField: (d: { date: string | number | Date; }) => new Date(d.date),
        yField: 'unemployed',
        colorField: 'industry',
        shapeField: 'smooth',
        axis: {
            x: {
                title: false,
                labelFormatter: (time: any) => new Date(`${time}`).toLocaleTimeString()
            },
        },
        stack: true, // Try to remove this line.
    };
    return <Area {...config} />;
};

export default ChartArea;