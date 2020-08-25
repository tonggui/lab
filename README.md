# on-waimai-e-product

> 闪购商品管理项目
>
> 技术栈：Vue + Roo-Vue
> 
> 发布工具：Talos
>
> 场景：B端（商家端）、M端（先富）

## 发布地址

http://talos.sankuai.com/#/project/1308?page_num=1

## 商家端地址
线上：https://e.waimai.meituan.com//#/v2/shop/productManage

st: https://e.waimai.st.sankuai.com/#/v2/shop/productManage

test：http://e.b.waimai.test.sankuai.com/#/v2/shop/productManage

dev：http://e.b.waimai.dev.sankuai.com/#/v2/shop/productManage

## 先富端地址
线上：


## 项目目录结构
```
├── _mock: mock 文件
├── build: 打包存放文件
├── node_modules: 依赖
├── public: 模版
├── src: 主要内容
└── tests: 测试用例
```
src内部结构
```
├── assets: 存放图片资源
├── bootes: bootes（roo-vue）的一些设置
├── common: 通用的工具函数
├── components: 通用组件
├── data: 数据层 主要就是接口的 发送和清洗
├── directives: vue全局指令
├── filters: vue全局的过滤器
├── hoc: 高阶组件
├── mixins: vue的mixins
├── module: cmm模块管理
├── plugins: vue插件
├── router: vue-router，router的配置
├── store: vuex设置
├── styles: 全局css样式 + less变量 + 通用css样式
├── transitions: 封装的一些通用的transitions动画
└── views: 视图层，每个页面对应的入口
```
views 结构
```
├── batch-management: 批量管理页面（单/多店）
├── category-template: 分类模版（不属于页面，但是独立于页面）
├── celluar-missing-product-list: 蜂窝缺失商品列表（算法推荐快捷上架商品）
├── components: 业务组件存放位置（TODO：位置不是很合适，需要优化）
├── edit-page-common: 
├── error: 错误兜底页面
├── hotRecommend: 热卖推荐页面
├── medicine: 药品相关页面（待废弃）
├── merchant: 商家商品中心 页面
├── monitor: 商品监控
├── product-edit: 单门店 新建/编辑 页面
├── product-list: 单门店 商品管理 列表页
├── product-audit-check: 单门店 商家端 商品审核详情页面
├── product-audit-edit: 单门店 运营端 商品审核详情页面
├── product-audit-list: 单门店 商家端 商品审核列表页面
├── sp-apply: 单门店 药品标品审核详情 页面
├── sp-audit-list: 单门店 药品标品审核列表 页面
├── new-product-audit: 商超/药品融合新的 单门店 运营端 商品审核详情页面
├── new-product-audit-check: 商超/药品融合新的 单门店 商家端 商品审核详情页面
├── new-product-audit-check-edit: 商超/药品融合新的 单门店 商家端 商品审核中修改页面
├── new-product-edit: 商超/药品融合新的 单门店 新建/编辑 页面
├── new-sp-apply: 商超/药品融合新的 单门店 药品标品审核 页面
├── priceAnomaly: 价格异常页面
├── product-package-edit: 组包商品 编辑
├── product-recommend: 商品魔方 商家建品 推荐
├── product-setting: 商品设置 - 库存清0自动下架
├── progress: 任务进度页面（单门店/多门店/商家商品中心 均复用）
├── recycle: 回收站页面
├── search-list: 单门店 商品管理 搜索列表页
├── sp-create: 从商品库新建商品 页面
├── stockAnomaly: 库存异常页面
├── unsalable: 滞销商品页面
├── video-center: 视频中心
└── violation-info: 门店违规信息
```
merchant 商家商品中心 结构
```
├── components: 商家商品中心 公共组件
└── product
// product 结构
├── approve-list: 商家商品中心 待收录页
├── associated-poi: 商家商品中心 商品关联门店详情页
├── audit-list: 商家商品中心 审核列表
├── product-audit-check: 商家商品中心 商家端 审核详情页面
├── product-audit-check-edit: 商家商品中心 审核中 详情页面
├── product-audit-edit: 商家商品中心 运营端 审核详情页面
├── product-edit: 商品/药品 融合新的 商品 新建/编辑页
├── edit: 商家商品中心 商品 新建/编辑页
├── list: 商家商品中心 商品管理 列表页
└── search-list: 商家商品中心 商品管理 搜索列表页
```

## 页面灰度控制
商品管理的页面级别灰度使用 @sgfe/eproduct 库，此库主要用于页面级别的灰度控制，配合 src/components/link 组件使用

页面灰度主要流程：
1. 定灰度字段
2. @sgfe/eproduct 中写判断逻辑
3. mcc配置灰度字段


## 安装依赖
```
yarn install
```

### dev 启动命令
```
yarn run serve
```

### 本地转发 各环境接口 命令
```
// 本地启动服务并将接口转发到dev环境
PROXY=dev yarn run serve

// 本地启动服务并将接口转发到test环境
PROXY=test yarn run serve

// 本地启动服务并将接口转发到st环境
PROXY=st yarn run serve
```

### build 命令
```
yarn run build
```

### 测试命令
```
yarn run test
```

### eslint 校验命令
```
yarn run lint
```

### e2e 测试 命令
```
yarn run test:e2e
```

### 单测 命令
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
