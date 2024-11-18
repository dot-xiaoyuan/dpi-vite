import {Area} from "@ant-design/charts";
import React from "react";
import {AreaChartData} from "../../types/area.tsx";

interface AreaProps {
    data: AreaChartData[];
}
const ChartArea: React.FC<AreaProps> = ({data}) => {
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