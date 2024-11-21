import React from 'react';
import {Change} from "../../types/observer.tsx";
import {Line} from "@ant-design/charts";
import { Empty } from "antd";

interface TtlProps {
    data: Change[] | null;
}

const TTLChart: React.FC<TtlProps> = ({data}) => {
    if (data && data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无数据" />;
    }
    const config = {
        data,
        height: 200,
        xField: 'time',
        yField: 'value',
        xAxisField: 'name',
        smooth: true,
        shapeField: 'hvh',
        colorField: 'value',
        axis: {
            x: {
                title: false,
                labelFormatter: (time: any) => new Date(`${time}`).toLocaleTimeString()
            },
        },
        style: {
            gradient: 'y',
            lineWidth: 1.5,
            lineJoin: 'round',
        },
        scale: {
            x: {utc: false},
            y: {nice: true},
            color: {type: 'threshold', domain: [128], range: ['black', 'red']},
        },
    };

    return <Line {...config} />;
}

export default TTLChart;