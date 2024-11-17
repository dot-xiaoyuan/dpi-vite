import React from "react";
import { Pie } from "@ant-design/charts";

interface ProtocolData {
    type: string;
    value: number;
}

interface AppProtocolProps {
    data: ProtocolData[];
    title: string;
}

const ProtocolChart: React.FC<AppProtocolProps> = ({ data, title }) => {
    const config = {
        data,
        angleField: "value",
        colorField: "type",
        radius: 1,
        innerRadius: 0.6,
        label: {
            type: "inner",
            offset: "-30%",
            content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(2)}%`,
            style: {
                textAlign: "center",
            },
        },
        meta: {
            value: { alias: title },
        },
        autoFit: true,
        tooltip: {
            showTitle: false,
        },
    };

    return <Pie {...config} />;
};

export default ProtocolChart;
