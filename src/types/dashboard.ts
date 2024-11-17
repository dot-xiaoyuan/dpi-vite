export interface DashboardCharts {
    application: ApplicationChart[] | null;
    application_layer: ApplicationLayerChart[] | null;
    traffic: TrafficChartData[] | null;
    transport_layer: TransportLayerChart[] | null;
}

export interface ApplicationChart {
    name: string;
    value: number;
}

export interface ApplicationLayerChart {
    type: string;
    value: number;
}

export interface TrafficChartData {
    date: string; // 可以考虑使用 Date 类型，但需要解析字符串
    type: 'up_stream' | 'down_stream'; // 限定为这两种类型
    value: number;
}

export interface TransportLayerChart {
    type: 'TCP' | 'UDP'; // 限定为这两种类型
    value: number;
}

export interface DashboardData {
    charts: DashboardCharts;
    total: {
        packets: number;
        sessions: number;
        traffics: number;
    };
}