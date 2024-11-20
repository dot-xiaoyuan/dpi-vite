import apiClient from "./api.ts";

export const TerminalIdentification = async (
    page = 1,
    pageSize = 20,
    sortField?: string | undefined,
    sortOrder?: string | undefined,
) => {
    const params: Record<string, any> = {
        page,
        pageSize
    };
    if (sortField) params.sortField = sortField;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await apiClient.post('/terminal/identification', params);
    return response.data;
}

export const TerminalUseragentRecord = async (
    p?: { pageSize?: number; page?: number },
    collection?: string,
    condition?: string,
) => {
    const params: Record<string, any> = {
        ...p,
        ...(collection && {collection}),
        ...(condition && {condition}), // 仅在 condition 存在时添加
    };

    try {
        const response = await apiClient.post('/terminal/useragent', params);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const TerminalApplication = async (
    p?: { pageSize?: number; page?: number },
    collection?: string,
    condition?: string,
) => {
    const params: Record<string, any> = {
        ...p,
        ...(collection && {collection}),
        ...(condition && {condition}), // 仅在 condition 存在时添加
    };

    try {
        const response = await apiClient.post('/terminal/application', params);
        return response.data;
    } catch (error: any) {
        throw error;
    }
}

export const TerminalDetail = async (
    ip: string
) => {
    const params: Record<string, any> = {
        ip: ip
    };
    const response = await apiClient.post('/terminal/detail', params);
    return response.data;
}

export const JudgeRealtime = async (
    p?: { pageSize?: number; page?: number },
    collection?: string,
    condition?: string,
) => {
    const params: Record<string, any> = {
        ...p,
        ...(collection && {collection}),
        ...(condition && {condition}), // 仅在 condition 存在时添加
    };
    const response = await apiClient.post("/feature/judge/realtime", params);
    return response.data;
}

export const PolicyList = async () => {
    const response = await apiClient.get("/policy/list");
    return response.data;
}

export const UpdatePolicy = async (
    p?: { all: number | undefined; products_id: string | number; pc: number | undefined; mobile: number | undefined },
) => {
    const params: Record<string, any> = {
        ...p
    }
    return await apiClient.post("/policy/update", params);
}