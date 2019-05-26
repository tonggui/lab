const path = require("path");
const { spawn } = require("child_process");

// https://cli.vuejs.org/zh/config
module.exports = {
  publicPath: process.env.BASE_URL,

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },

  transpileDependencies: [
    /@sgfe\/eproduct/,
    /@sgfe\/product-validate/,
    /@sgfe\/reco-fe-theme-shangou-b\/lib/
  ],

  devServer: {
    port: 3030,
    host: "0.0.0.0",
    disableHostCheck: true,
    inline: true, // 实时刷新
    hot: true, // 使用热加载插件 HotModuleReplacementPlugin
    overlay: true,
    stats: "minimal", // https://www.webpackjs.com/configuration/stats/
    before: app => {
      const proxy = process.env.PROXY;
      if (proxy) {
        app.use((req, res, next) => {
          const apiPrefix = "/api/reuse/sc/product";
          let url = req.originalUrl || req.url;
          if (url.indexOf(apiPrefix) >= 0) {
            if (url.indexOf("?") === -1) {
              url += "?";
            }
            url += `&u=2137588&c=reuse_M_queenbee&n=luodetao`;
            url = url.replace(apiPrefix, `/${proxy}/api/reuse/sc/product`);
            req.url = url;
            req.originalUrl = url;
          }
          return next();
        });
      }

      // 使用nodemon启动mockServer
      // nodemon('./_mock/server --watch _mock')
      const cp = spawn(
        "node",
        ["./node_modules/.bin/nodemon", "./_mock/server", "--watch", "_mock"],
        {
          stdio: ["pipe", "pipe", "pipe", "ipc"]
        }
      );
      process.on("SIGINT", () => {
        cp.emit("close");
        process.exit(0);
      });
    },
    proxy: {
      "/api": {
        target: "http://localhost:10010"
      },
      "/dev/api/reuse/sc/product": {
        target: "http://eproductapi.sc.waimai.dev.sankuai.com",
        pathRewrite: { "^/dev/api": "" },
        changeOrigin: true,
        secure: false
      },
      "/test/api/reuse/sc/product": {
        target: "http://eproductapi.sc.waimai.test.sankuai.com",
        pathRewrite: { "^/test/api": "" },
        changeOrigin: true,
        secure: false
      },
      "/st/api/reuse/sc/product": {
        target: "http://eproductapi.sc.waimai.st.sankuai.com",
        pathRewrite: { "^/st/api": "" },
        changeOrigin: true,
        secure: false
      }
    }
  },

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/styles/var.less")]
    }
  }
};
