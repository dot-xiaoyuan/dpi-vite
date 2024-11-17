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
        annotations: [
            {
                type: 'text',
                style: {
                    text: title,
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    // fontSize: 15,
                    fontStyle: 'bold',
                },
            },
        ],
    };

    return <Pie {...config} />;
};

export default ProtocolChart;
