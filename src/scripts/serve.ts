import colors from 'colors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getConfigs } from '../utils/config';

export const serve = (serveSdk = false) => {
    const configs = getConfigs()
    const devServe = express();
    // 1. 跨域设置
    devServe.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', req.originalUrl);
        next();
    });
    // 2. 静态资源服务
    devServe.use(express.static(serveSdk && configs.sdk.type ==='local' ? configs.sdk.location : configs.output));
    // 3. 代理设置
    if (configs.dev.proxyPath && configs.dev.proxyOption) {
        devServe.use(
            configs.dev.proxyPath,
            createProxyMiddleware(configs.dev.proxyOption)
        );
    }
    // 4. 启动开发服务器
    devServe.listen(configs.dev.port, () => {
        console.log(colors.green('\nServing!\n'), colors.grey(`- Local: http://${configs.dev.host}:${configs.dev.port}\n`));
        setTimeout(() => {
            require('child_process').exec(`${process.platform === 'win32' ? 'start' : 'open'} http://${configs.dev.host}:${configs.dev.port}`);
        }, 1);
    });
}