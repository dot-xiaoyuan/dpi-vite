import React, {useEffect, useState} from "react";
import {Card, Col, Row, Space, Statistic} from "antd";
import Traffic from "../../components/charts/traffic";
import AppChart from "../../components/charts/app";
import ProtocolChart from "../../components/charts/protocol";
import {ApplicationChart, ApplicationLayerChart, TrafficChartData, TransportLayerChart,} from "../../types/dashboard";
import {dashboard} from "../../services/authService.ts";

const Dashboard: React.FC = () => {
    const [application, setApplication] = useState<ApplicationChart[]>([]);
    const [applicationLayer, setApplicationLayer] = useState<ApplicationLayerChart[]>([]);
    const [traffic, setTraffic] = useState<TrafficChartData[]>([]);
    const [transportLayer, setTransportLayer] = useState<TransportLayerChart[]>([]);
    const [totalPackets, setTotalPackets] = useState<number>(0);
    const [totalSessions, setTotalSessions] = useState<number>(0);
    const [totalTraffics, setTotalTraffics] = useState<number>(0);

    useEffect(() => {
        let isMounted = true;

        dashboard()
            .then((res) => {
                let result = res.data
                if (isMounted && result) {
                    // console.log(result);
                    // 设置 Dashboard 数据
                    setApplication(result.charts.application || []);
                    setApplicationLayer(result.charts.application_layer || []);
                    setTraffic(result.charts.traffic || []);
                    setTransportLayer(result.charts.transport_layer || []);
                    setTotalPackets(result.total.packets || 0);
                    setTotalSessions(result.total.sessions || 0);
                    setTotalTraffics(result.total.traffics || 0);
                }
            })
            .catch(() => {
                // console.error("Error fetching dashboard data:", error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{display: "flex"}}>
            {/* 数据统计 */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic title="总流量" value={totalTraffics}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic title="总包数" value={totalPackets}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false}>
                        <Statistic title="总会话数" value={totalSessions}/>
                    </Card>
                </Col>
            </Row>

            {/* 协议和应用分布 */}
            <Row gutter={16}>
                <Col span={4}>
                    <Card bordered={false}>
                        <ProtocolChart data={transportLayer} title="传输层协议分布"/>
                    </Card>
                </Col>
                <Col span={4}>
                    <Card bordered={false}>
                        <ProtocolChart data={applicationLayer} title="应用层协议分布"/>
                    </Card>
                </Col>
                <Col span={16}>
                    <Card bordered={false}>
                        <AppChart data={application} show={application.length > 0}/>
                    </Card>
                </Col>
            </Row>

            {/* 流量趋势 */}
            <Row gutter={16}>
                <Col span={24}>
                    <Card bordered={false}>
                        <Traffic data={traffic}/>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
};

export default Dashboard;
