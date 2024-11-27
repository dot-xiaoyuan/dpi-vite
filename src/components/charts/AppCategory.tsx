import { Pie } from '@ant-design/plots';
import {Empty} from "antd";

const AppCategoryChart: React.FC<any> = ({data}) => {
    if (data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无数据"/>;
    }
    const config = {
        data,
        // xField: 'type',
        // yField: 'value',
        angleField: 'value',
        colorField: 'type',
    };
    return <Pie {...config} />;
};

export default AppCategoryChart;