import {message} from "antd";
import apiClient from "./api.ts";

/**
 * 通用请求函数
 * @param endpoint API端点
 * @param method HTTP方法，默认是GET
 * @param body 请求体，适用于POST
 */
const fetchData = async <T>(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: any
): Promise<T | undefined> => {
    message.open({type: "loading", content: "loading...", duration: 0});
    try {
        const config = {
            method,
            url: endpoint,
            data: method === "POST" ? body : undefined,
        };

        const response = await apiClient.request<Response>(config);
        const result = response;

        // if (result.code !== 0) {
        //     throw new Error(result.message || "请求失败");
        // }

        return result.data;
    } catch (error) {
        message.error(`请求错误: ${error instanceof Error ? error.message : error}`);
    } finally {
        message.destroy();
    }
};

export default fetchData;

// 示例接口方法
export const getDashboard = () => fetchData(`/dashboard`);

export const getStreamLogs = (params: any) => fetchData(`/stream/list`, "POST", params);

export const getIptables = (page: number = 1, pageSize: number = 20) =>
    fetchData(`/ip/list?page=${page}&pageSize=${pageSize}`);

export const getIPDetail = (ip: string) => fetchData(`/ip/detail?ip=${ip}`);

export const getObserverTTL = (page: number = 1, pageSize: number = 10) =>
    fetchData(`/observer/ttl?page=${page}&pageSize=${pageSize}`);

export const getObserverMac = (page: number = 1, pageSize: number = 10) =>
    fetchData(`/observer/mac?page=${page}&pageSize=${pageSize}`);

export const getObserverUa = (page: number = 1, pageSize: number = 10) =>
    fetchData(`/observer/ua?page=${page}&pageSize=${pageSize}`);

export const getOnlineUsers = (page: number = 1, pageSize: number = 10) =>
    fetchData(`/users/list?page=${page}&pageSize=${pageSize}`);

export const getUserEvents = (page: number = 1, pageSize: number = 10) =>
    fetchData(`/users/events/log?page=${page}&pageSize=${pageSize}`);
