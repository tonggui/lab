const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    console.log('---'+process.env.REACT_APP_BASE_URL)
    app.use(createProxyMiddleware([process.env.REACT_APP_API], {
        target: "http://10.112.222.93:8000/", //配置你要请求的服务器地址
        changeOrigin: true,
        pathRewrite: {
            '^/devApi': ''
        },
    }))
    // /devApi/login/
    /**
     * 1、匹配到devApi，开始做代理  http://www.web-jshtml.cn/api/react
     * 2、/devApi/login/ => /login/
     * 3、替换之后的地址：http://www.web-jshtml.cn/api/react/login/
     */
    // app.use(proxy("/devApi", {
    //     target: "http://10.112.222.93:8000/" ,
    //     changeOrigin: true,
    // }))
};
