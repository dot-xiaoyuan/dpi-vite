export interface DeviceRecord {
    ip: string;
    os: string | null;
    version: string | null;
    device: string | null;
    brand: string | null;
    model: string | null;
    icon: string | null;
}

export interface DeviceRecordLogs {
    _id: string;
    ip: string;
    origin_chanel: string
    origin_value: string
    os: string | null;
    version: string | null;
    device: string | null;
    brand: string | null;
    model: string | null;
    remark: string | null;
    last_seen: string | null;
}
