const path = require('path');
const { spawn } = require('child_process');
const webpack = require('webpack');

// Talos 环境变量
const {
  PUBLIC_URL,
  SOURCEMAP_PUBLIC_URL,
  GENERATE_SOURCEMAP,
  AWP_FLOW_ID,
  ENV,
  AWP_DEPLOY_ENV, NODE_ENV
} = process.env;
const sourceMapSwitch = GENERATE_SOURCEMAP !== '0';
process.env.VUE_APP_ENV = AWP_DEPLOY_ENV;
process.env.VUE_APP_WEB_VERSION = AWP_FLOW_ID;

const isProd = NODE_ENV === 'production';
const plugins = [];
if (sourceMapSwitch) {
  const sourceMapPlugin = isProd ? webpack.SourceMapDevToolPlugin : webpack.EvalSourceMapDevToolPlugin
  plugins.push(
    new sourceMapPlugin({
      filename: 'sourcemaps/[file].map',
      publicPath: SOURCEMAP_PUBLIC_URL,
    })
  );
}

if (ENV === 'local') {
  plugins.push(new webpack.EnvironmentPlugin(['ENV']));
}

// https://cli.vuejs.org/zh/config
module.exports = {
  publicPath: PUBLIC_URL || '/',

  outputDir: path.resolve(__dirname, './build'),

  transpileDependencies: [
    /@sgfe\/eproduct/,
    /@sgfe\/owl/,
    /@sgfe\/product-validate/,
    /@sgfe\/reco-fe-tim-lx\/src/,
    /@sgfe\/dynamic-form-vue\/src/,
    /@sgfe\/reco-fe-theme-shangou-b\/lib/,
    /@roo-design\/roo-vue\/src/
  ],

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },

  configureWebpack: {
    devtool: false,
    plugins
  },

  chainWebpack: (config) => {
    // remove cache-loader
    config.module.rule('vue').uses.delete('cache-loader');
    config.module.rule('js').uses.delete('cache-loader');
    config.module
      .rule('eslint')
      .exclude
        .add(path.join(__dirname, './src/data'))
        .end();
    config.module
      .rule('source-map')
      .test(/\.js$/)
      .pre()
      .include
        .add(path.resolve(__dirname, 'node_modules/@roo-design/roo-vue/dist'))
        .end()
      .use('source-map-loader')
      .loader('source-map-loader');
    config.module
      .rule('ts')
        .test(/\.ts$/)
        .use('ts-loader')
        .loader('ts-loader');
    config.module
      .rule('eslint-ts')
        .test(/\.ts$/)
        .pre()
        .include
          .add(path.join(__dirname, './src/data'))
          .end()
        .use('eslint-loader')
        .loader('eslint-loader')
        .options({
          eslintPath: 'eslint',
          baseConfig: {
            parser: "@typescript-eslint/parser",
            "parserOptions": {
              "ecmaVersion": 6,
              "sourceType": "module",
              "project": "./tsconfig.json",
              "ecmaFeatures": {
                "modules": true,
              },
            },
            plugins: ["import", "@typescript-eslint/tslint"]
          },
          useEslintrc: false
        })
    // replace svg rule from file-loader to svg-loader
    config.module.rule('svg')
      .exclude.add(path.resolve(__dirname, 'src/assets/icons')).end()
      .exclude.add(path.resolve(__dirname, 'src/assets/will-be-removed-icons')).end()
    config.module.rule('svg-local')
      .test(/\.svg/)
      .include.add(path.resolve(__dirname, 'src/assets/icons')).end()
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
        .loader('vue-svg-loader')
        .options({
          svgo: {
            plugins: [
              { prefixIds: true },
              { removeTitle: true },
              { removeDesc: true },
              { removeComments: true },
              { removeViewBox : false },
              { removeDimensions : true },
              { addAttributesToSVGElement: { attributes: [{ width: '1em', height: '1em' }] } },
            ],
          }
        })
    config.module.rule('svg-customer-icon')
      .test(/\.svg/)
      .include.add(path.resolve(__dirname, 'src/assets/will-be-removed-icons')).end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.resolve.extensions
      .add('.js')
      .add('.ts')
      .add('.vue');
    config.resolve.alias
      // .set('@sfe/bootes', '@sfe/bootes/packages')
      .set('@components', path.resolve(__dirname, './src/components'))
      .set('@', path.resolve(__dirname, './src'))
  },

  devServer: {
    port: 3031,
    host: 'localhost',
    disableHostCheck: true,
    inline: true, // 实时刷新
    hot: true, // 使用热加载插件 HotModuleReplacementPlugin
    open: true,
    openPage: 'product/list?wmPoiId=649726',
    overlay: {
      warnings: true,
      errors: true
    },
    stats: 'minimal', // https://www.webpackjs.com/configuration/stats/
    before: app => {
      const proxy = process.env.PROXY;
      const uid = process.env.PROXY_UID || '2137588'
      const client = process.env.PROXY_CLIENT === 'B' ? 'reuse_B_waimai_e' : 'reuse_M_queenbee'
      if (proxy) {
        app.use((req, res, next) => {
          const apiPrefix = '/api/reuse/sc/product';
          let url = req.originalUrl || req.url;
          if (url.indexOf(apiPrefix) >= 0) {
            if (url.indexOf('?') === -1) {
              url += '?';
            }
            url += `&u=${uid}&c=${client}&n=luodetao`;
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
        'node',
        ['./node_modules/.bin/nodemon', './_mock/server', '--watch', '_mock'],
        {
          stdio: ['pipe', 'pipe', 'pipe', 'ipc']
        }
      );
      process.on('SIGINT', () => {
        cp.emit('close');
        process.exit(0);
      });
    },
    proxy: {
      '^/api': {
        target: 'http://localhost:10010'
      },
      '^/api/reuse/mpc/product': {
        target: 'http://e.shangou.test.sankuai.com',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false
      },
      '^/dev/api/reuse/sc/product': {
        target: 'http://eproductapi.sc.waimai.dev.sankuai.com',
        pathRewrite: { '^/dev/api': '' },
        changeOrigin: true,
        secure: false
      },
      '^/test/api/reuse/sc/product': {
        target: 'http://e.shangou.test.sankuai.com/',
        pathRewrite: { '^/test/api': '' },
        changeOrigin: true,
        secure: false
      },
      '^/reuse/sc/product/views/setting': {
        target: 'https://shangoue.meituan.com'
      },
      '^/reuse/sc/product/retail/r': {
        target: 'https://shangoue.meituan.com'
      },
      // '^/test/api/reuse/sc/product': {
      //   target: 'http://queenbee.m.waimai.test.sankuai.com',
      //   pathRewrite: { '^/test/api': '' },
      //   router: function(req) {
      //     const merchantId = req.headers.merchantId
      //     if (merchantId) {
      //       return {
      //         protocol: 'http:',
      //         host: 'queenbee.m.waimai.test.sankuai.com',
      //         query: { merchantId }
      //       }
      //     }
      //     return 'http://queenbee.m.waimai.test.sankuai.com';
      //   },
      //   changeOrigin: true,
      //   secure: false
      // },
      '^/st/api/reuse/sc/product': {
        target: 'http://eproductapi.sc.waimai.st.sankuai.com',
        pathRewrite: { '^/st/api': '' },
        changeOrigin: true,
        secure: false
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/styles/var.less')]
    }
  }
};
