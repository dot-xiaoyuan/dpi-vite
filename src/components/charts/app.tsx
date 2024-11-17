import React from "react";
import { Bar } from "@ant-design/charts";
import { Empty } from "antd";
import { ApplicationChart } from "../../types/dashboard";

interface ApplicationProps {
    show: boolean;
    data: ApplicationChart[];
}

const AppChart: React.FC<ApplicationProps> = ({ show, data }) => {
    if (!show || data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无应用数据" />;
    }

    const config = {
        data,
        xField: "name",
        yField: "value",
        color: "#1890ff", // 使用 Ant Design 默认主题色
        label: {
            position: "middle",
            style: {
                fill: "#fff",
                opacity: 0.8,
            },
        },
        interactions: [{ type: "active-region" }],
        autoFit: true,
        tooltip: {
            showTitle: false,
        },
    };

    return <Bar {...config} />;
};

export default AppChart;
