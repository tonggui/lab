const path = require("path");
const { spawn } = require("child_process");

// https://cli.vuejs.org/zh/config
module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src'),
        '@pages': path.resolve('src/pages'),
        '@assets': path.resolve('src/assets'),
        '@utils': path.resolve('src/utils'),
        '@config': path.resolve('src/config'),
        '@components': path.resolve('src/components'),
        '@router': path.resolve('src/router')
      }
    }
  },

  chainWebpack: config => {
    const svgRule = config.module.rule('svg').test(/\.svg$/)
    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()
    // 添加要替换的 loader
    svgRule
      .include.add(path.resolve('src/assets/icons')).end()
        .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
            .options({
              symbolId: 'icon-[name]'
            })
    const svgRule1 = config.module.rule('svg1').test(/\.(svg)(\?.*)?$/)
    svgRule1.uses.clear()
    svgRule1
      .exclude.add(path.resolve('src/assets/icons')).end()
        .use('file-loader')
          .loader('file-loader')
            .options({
              name: 'img/[name].[hash:8].[ext]'
            })
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
