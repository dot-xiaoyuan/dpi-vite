import { Pie } from "@ant-design/plots";
import {Empty} from "antd";

const ProtocolLayerChart: React.FC<any> = ({data}) => {
    if (data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无数据"/>;
    }
    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        tooltip: { name: '数值', value: 'value', channel: 'y'}
    };
    return <Pie {...config} />;
};

export default ProtocolLayerChart;