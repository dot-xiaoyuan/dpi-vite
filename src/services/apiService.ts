import apiClient from "./api.ts";

export const ChangePass = async (
    old_password: string,
    new_password: string,
)=> {
    const params: Record<string, any> = {
        old_password,
        new_password,
    }
    return await apiClient.post("/change-password", params);
}

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

export const JudgeSuspected = async (
    p?: { pageSize?: number; page?: number },
    collection?: string,
    condition?: string,
) => {
    const params: Record<string, any> = {
        ...p,
        ...(collection && {collection}),
        ...(condition && {condition}), // 仅在 condition 存在时添加
    };
    const response = await apiClient.post("/feature/judge/suspected", params);
    return response.data;
}

export const UserEventsLog = async (
    p?: { pageSize?: number; page?: number },
    collection?: string,
    condition?: string,
) => {
    const params: Record<string, any> = {
        ...p,
        ...(collection && {collection}),
        ...(condition && {condition}), // 仅在 condition 存在时添加
    };
    const response = await apiClient.post("/log/users/events", params);
    return response.data;
}

export const GetConfig = async (
) => {
    return await apiClient.get("/setting/config");
}

export const UpdateConfig = async (
    params:any
) => {
    return await apiClient.put("/setting/config", params);
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

// 特征概览
export const GetFeatureLibrary = async () => {
    return await apiClient.post("/feature/library");
}

// 上传特征更新
export const UploadFeature = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post("/upload", formData);
}

// 更新特征库
export const UpdateFeatureLibrary = async (params:any) => {
    return await apiClient.post("/feature/library", params);
}
