import React, {useEffect, useRef, useState} from 'react';
import {SsoManage} from "../../services/apiService.ts";

interface DynamicIframeProps {
    /** 跳转地址，用于请求加密数据 */
    redirectUrl: string;
    /** 可选的宽度，默认 100% */
    width?: string;
    /** 可选的初始高度，默认 1000 */
    height?: string;
}

const DynamicIframe: React.FC<DynamicIframeProps> = ({
                                                         redirectUrl,
                                                         width = '100%',
                                                         height = '1000'
                                                     }) => {
    const [iframeSrc, setIframeSrc] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // iframe 加载完成后自动调整高度
    const onIframeLoad = () => {
        const iframe = iframeRef.current;
        try {
            const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
            if (doc) {
                const newHeight = doc.documentElement.scrollHeight;
                iframe.style.height = `${newHeight}px`;
            }
        } catch (error) {
            console.error('无法获取iframe内容高度：', error);
        }
    };

    useEffect(() => {
        const fetchEncryptedData = async () => {
            try {
                // 将传入的 redirectUrl 动态传递到接口请求中
                const res: any = await SsoManage({redirect_url: redirectUrl});
                const encryptedData = res.data;
                const currentHost = window.location.host.split(':')[0];
                const url = `http://${currentHost}:8080/site/sso?algo=240&company=bldc&data=${encodeURIComponent(encryptedData)}`;
                setIframeSrc(url);
            } catch (error) {
                console.error('请求加密数据出错:', error);
            }
        };

        fetchEncryptedData();
    }, [redirectUrl]);

    if (!iframeSrc) {
        return <div>加载中...</div>;
    }

    return (
        <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="Embedded Page"
            width={width}
            height={height}
            onLoad={onIframeLoad}
            style={{border: 'none'}}
        />
    );
};

export default DynamicIframe;
