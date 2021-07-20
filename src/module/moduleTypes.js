// 商品列表页 从商品库新建入口
export const PRODUCT_CREATE_ENTRANCE = 'PRODUCT_CREATE_ENTRANCE'
// 是否支持商品 批量上传图片
export const BATCH_UPLOAD_IMAGE = 'BATCH_UPLOAD_IMAGE'
// 是否 支持 批量新建使用商品库图片
export const BATCH_CREATE_USE_SP_IMAGE = 'BATCH_CREATE_USE_SP_IMAGE'
// 商品限购
export const PRODUCT_LIMIT_SALE = 'PRODUCT_LIMIT_SALE'
// 商品售卖时间功能
export const PRODUCT_SELL_TIME = 'SELL_TIME'
// 商品运费模板
export const PRODUCT_FREIGHT_TEMPLATE = 'FREIGHT_TEMPLATE'
// 快捷新建功能
export const PRODUCT_SHORTCUT = 'PRODUCT_SHORTCUT'
// 开关：推荐无条码输入
export const SWITCH_SUGGEST_NOUPC = 'SWITCH_SUGGEST_NOUPC'
// 商品描述功能
export const PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION'
// 商品打包袋
export const PRODUCT_PACK_BAG = 'PRODUCT_PACK_BAG'
// 图文详情
export const PRODUCT_PICTURE_CONTENT = 'PRODUCT_PICTURE_CONTENT'
// 商品标签
export const PRODUCT_LABEL = 'PRODUCT_LABEL'
// 图片是否支持编辑
export const PRODUCT_PICTURE_EDITABLE = 'PRODUCT_PICTURE_EDITABLE'
// 商品标题可编辑
export const PRODUCT_NAME_EDITABLE = 'PRODUCT_NAME_EDITABLE'
// product list 是否展示 信息不全的 tab
export const PRODUCT_INCOMPLETE_TAB = 'PRODUCT_INCOMPLETE_TAB'
// 多分类个数
export const PRODUCT_TAG_COUNT = 'PRODUCT_TAG_COUNT'
// 是否支持商品视频
export const PRODUCT_VIDEO = 'PRODUCT_VIDEO'
// 商品 是否支持 智能排序
export const PRODUCT_SMART_SORT = 'PRODUCT_SMART_SORT'

// 门店 热卖推荐 开关
export const POI_HOT_RECOMMEND = 'POI_HOT_RECOMMEND'
// 门店 是否 命中风控
export const POI_RISK_CONTROL = 'POI_RISK_CONTROL'
// 门店 违规 入口 是否展示
export const POI_VIOLATION = 'POI_VIOLATION'
// 门店 购物袋袋 入口 是否展示 和订单相关 和商品打包袋不是一个东西
export const POI_SHOPPING_BAG = 'POI_SHOPPING_BAG'
// 门店 回收站 入口 是否展示
export const POI_RECYCLE = 'POI_RECYCLE'
// 门店 是否有中间态 商品
export const POI_TRANSITION_PRODUCT = 'POI_TRANSITION_PRODUCT'
// 门店 异常商品 数量
export const POI_ERROR_PRODUCT_COUNT = 'POI_ERROR_PRODUCT_COUNT'
// 门店 未关联 商品 数量
export const POI_UN_RELATION_PRODUCT_COUNT = 'POI_UN_RELATION_PRODUCT_COUNT'
// 门店 是否支持配置 缺货自动库存清零
export const POI_AUTO_CLEAR_STOCK = 'POI_AUTO_CLEAR_STOCK'
// 门店 是否展示 商品审核 入口
export const POI_AUDIT_ENTRANCE = 'POI_AUDIT_ENTRANCE'
// 门店 是否展示 标品审核 入口
export const POI_SP_AUDIT_ENTRANCE = 'POI_SP_AUDIT_ENTRANCE'
// 是否是商家商品中心的账号
export const MERCHANT_ACCOUNT = 'MERCHANT_ACCOUNT'
// 账号是否是单经营品类的
export const SINGLE_BUSINESS = 'SINGLE_BUSINESS'

// 分类 是否支持 限时置顶
export const TAG_TOP_TIME = 'TAG_TOP_TIME'
// 分类 是否支持 分类code
export const TAG_APP_CODE = 'TAG_APP_CODE'
// 分类 是否支持 智能排序
export const TAG_SMART_SORT = 'TAG_SMART_SORT'
// 分类模版 是否支持
export const CATEGORY_TEMPLATE = 'CATEGORY_TEMPLATE'
// b端分类模版是否支持 = 支持分类模版 && 有b端模版
export const BUSINESS_CATEGORY_TEMPLATE = 'BUSINESS_CATEGORY_TEMPLATE'
// 分类模版 分类新建提示 门店 一级分类上线
export const TAG_FIRST_LEVEL_LIMIT = 'TAG_FIRST_LEVEL_LIMIT'
// 分类模版 分类引导配置信息
export const TAG_FIRST_LEVEL_GUIDE = 'TAG_FIRST_LEVEL_GUIDE'
// 待收录商品数量
export const UNAPPROVE_PRODUCT_COUNT = 'UNAPPROVE_PRODUCT_COUNT'

// 门店字段锁定
export const POI_PROPERTY_LOCKED = 'POI_PROPERTY_LOCKED'
// 隐藏自建商品
export const POI_CUSTOM_PRODUCT = 'POI_CUSTOM_PRODUCT'

// 门店 || 账号 经营品类 是药品
export const BUSINESS_MEDICINE = 'BUSINESS_MEDICINE'
// 门店 是否需要进行店内分类推荐
export const POI_RECOMMEND_TAG = 'POI_RECOMMEND_TAG'
// 门店 新建商品 是否自定填充 url上的tagId
export const POI_CREATE_PRODUCT_AUTO_FILL_TAG = 'POI_CREATE_PRODUCT_AUTO_FILL_TAG'

export const REL_POI_MAX_SIZE = 'REL_POI_MAX_SIZE'

// 商品标题的参考格式
export const PRODUCT_NAME_EXAMPLE = 'PRODUCT_NAME_EXAMPLE'
// 是否开启标品药品申报开关
export const MEDICINE_SP_APPLY = 'MEDICINE_SP_APPLY'
// 门店审核状态
export const POI_AUDIT_STATUS = 'POI_AUDIT_STATUS'
// 门店审核信息
export const POI_AUDIT_INFO = 'POI_AUDIT_INFO'
// 门店商品魔方入口
export const POI_PRODUCT_CUBE_ENTRANCE = 'POI_PRODUCT_CUBE_ENTRANCE'
// 门店一二期商品魔方入口
export const ALL_POI_PRODUCT_CUBE_ENTRANCE_SWITCH = 'ALL_POI_PRODUCT_CUBE_ENTRANCE_SWITCH'
// 门店商品魔方下发信息
export const POI_PRODUCT_CUBE_INFO = 'POI_NEW_RECOMMEND_INFO'

export const POI_DEFAULT_STOCK = 'POI_DEFAULT_STOCK'
// 门店 上单流程状态
export const POI_PROCESS_STATUS = 'POI_PROCESS_STATUS'
// 组包商品功能开关
export const PACKAGE_PRODUCT_MODULE_SWITCH = 'PACKAGE_PRODUCT_MODULE_SWITCH'
// 门店/账号 商品审核 开关
export const PRODUCT_AUDIT_SWITCH = 'PRODUCT_AUDIT_SWITCH'

// 页面灰度 PAGE_GRAY
export const PAGE_GRAY = 'PAGE_GRAY'

// 门店商品魔方二期入口
export const POI_PRODUCT_NEW_ARRIVAL_SWITCH = 'POI_PRODUCT_NEW_ARRIVAL_SWITCH'

// 门店商品魔方二期信息
// export const POI_PRODUCT_NEW_ARRIVAL_INFO = 'POI_PRODUCT_NEW_ARRIVAL_INFO'

// 是否关联医药商家商品中心
export const ASSOCIATE_MEDICINE_MERCHANT = 'ASSOCIATE_MEDICINE_MERCHANT'

// 商品配置管理
export const PRODUCT_PROMOTION_SETTING = 'PRODUCT_PROMOTION_SETTING'

// 开门营业天数
export const POI_BUSINESS_DAY = 'POI_BUSINESS_DAY'

// 医药商家商品中心是不是总分模式
export const HEAD_QUARTER_MODE = 'HEAD_QUARTER_MODE'
