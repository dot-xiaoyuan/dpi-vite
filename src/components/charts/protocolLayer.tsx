import { Column } from "@ant-design/charts";
import {Empty} from "antd";

const ProtocolLayerChart: React.FC<any> = ({data}) => {
    if (data.length === 0) {
        // 如果没有数据，展示空状态
        return <Empty description="暂无数据"/>;
    }
    const config = {
        data,
        xField: 'type',
        yField: 'value',
        style: {
            // 圆角样式
            radiusTopLeft: 10,
            radiusTopRight: 10,
        },
    };
    return <Column {...config} />;
};

export default ProtocolLayerChart;