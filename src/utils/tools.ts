// 流量格式化
export const formatTraffic = (value: number) => {
    console.log(value)
    if (value >= 1024 ** 3) {
        return `${(value / 1024 ** 3).toFixed(2)} GB`;
    } else if (value >= 1024 ** 2) {
        return `${(value / 1024 ** 2).toFixed(2)} MB`;
    } else if (value >= 1024) {
        return `${(value / 1024).toFixed(2)} KB`;
    }
    return `${value} B`;
};
