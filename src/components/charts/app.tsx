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
        title: "应用 TOP50",
        // colorField: "#108ee9",
        data,
        xField: 'name',
        yField: 'value',
        // color: '#40a9ff', // 自定义柱状图颜色
        // label: {
        //     style: {
        //         fill: '#fff', // 标签字体颜色
        //         opacity: 0.6,
        //     },
        // },
        interactions: [{type: 'element-active'}],
        autoFit: true, // 图表自动适应容器大小
    };

    return <Bar {...config} />;
};

export default AppChart;
