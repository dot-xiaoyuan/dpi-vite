import React, {useEffect, useRef, useState} from 'react';
import {SsoManage} from "../../../services/apiService.ts";

const Interfaces: React.FC = () => {
    const [iframeSrc, setIframeSrc] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const onIframeLoad = () => {
        const iframe = iframeRef.current;
        try {
            // 读取 iframe 内容的高度
            const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
            if (doc) {
                const height = doc.documentElement.scrollHeight;
                iframe.style.height = `${height}px`;
            }
        } catch (error) {
            console.error('无法获取iframe内容高度：', error);
        }
    };
    useEffect(() => {
        // 模拟请求接口获取加密后的 data
        const fetchEncryptedData = async () => {
            try {
                const res: any = await SsoManage({"redirect_url": "/interfaces/binding/index"});
                // 假设返回结果为 { "encrypted": "加密后的数据字符串" }
                const encryptedData = res.data;

                // 拼接到目标 URL 中，示例中将加密数据作为 data 参数传递
                const currentHost = window.location.host.split(":")
                console.log(currentHost[0]);
                const url = `http://${currentHost[0]}:8080/site/sso?algo=240&company=bldc&data=${encodeURIComponent(encryptedData)}`;
                console.log(url)
                setIframeSrc(url);
            } catch (error) {
                console.error('请求加密数据出错:', error);
            }
        };

        fetchEncryptedData();
    }, []);

    if (!iframeSrc) {
        return <div>加载中...</div>;
    }
    return (
        <iframe
            src={iframeSrc}
            title="Embedded Page"          // 用于无障碍访问，描述 iframe 内容
            width="100%"                    // 指定宽度
            height="1000"                   // 指定高度
            onLoad={onIframeLoad}
            style={{border: 'none'}}     // 可选样式，去除边框
        />
    );
}

export default Interfaces;
