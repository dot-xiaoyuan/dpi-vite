import React from "react";
import {Line} from "@ant-design/charts";
import {Empty} from "antd";
import {TrafficChartData} from "../../types/dashboard";
import {formatTraffic} from "../../utils/tools";

interface TrafficProps {
    data: TrafficChartData[];
}

const TrafficChart: React.FC<TrafficProps> = ({data}) => {
    if (data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无流量数据"/>;
    }

    const config = {
        data,
        xField: "date",
        yField: "value",
        colorField: 'type',
        scale: {color: {range: ['#30BF78', '#F4664A']}},
        tooltip: {
            channel: 'y',
            valueFormatter: (d: any) => formatTraffic(d),
        }
    };

    return <Line {...config} />;
};

export default TrafficChart;
