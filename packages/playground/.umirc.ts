import { defineConfig } from 'umi';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
    title: 'datasync-form-render-playground',
    nodeModulesTransform: {
        type: 'none',
    },
    routes: [{ path: '/', component: '@/pages/index' }],
    fastRefresh: {},
    chainWebpack: (memo) => {
        memo.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
            { languages: ['javascript', 'json'] },
        ]);
        return memo;
    },
    // webpack 会在静态文件路径前面添加 publicPath, 在html中可以看到 /umi.js 变成了 ./umi.js，
    //  此时部署到github page 上不会导致请求 umi.js 文件 404
    publicPath: './',
    // 设置路由前缀，通常用于部署到非根目录, 设置后改变 window.routerBase 的指向
    // 此时部署到 github page 上才不会白屏
    base: '/dataSync-form-renderer/',
});
