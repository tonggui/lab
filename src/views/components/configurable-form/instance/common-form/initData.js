import {
  SELLING_TIME_TYPE,
  PRODUCT_SELL_STATUS, PRODUCT_SALE_TYPE
} from '@/data/enums/product'
import moment from 'moment'
import { SKU_FIELD, SPU_FIELD } from '../../field'

/**
 * 兜底的默认的数据给是
 */
export const getProduct = () => ({
  upcCode: '',
  spId: 0,
  isSp: false,
  name: '',
  category: {},
  tagList: [],
  pictureList: [],
  marketingPicture: [],
  isMedicare: false,
  upcImage: '',
  video: null,
  spVideo: null,
  spVideoStatus: 0,
  skuList: [],
  limitSale: {
    status: 0,
    rule: 1,
    range: [moment().format('YYYY-MM-DD'), moment().add(29, 'd').format('YYYY-MM-DD')],
    max: 0
  },
  attributeList: [],
  shippingTime: {
    type: SELLING_TIME_TYPE.Infinite
  },
  labelList: [],
  description: '',
  picContentSyncPoi: true,
  pictureContentList: [],
  spPictureContentSwitch: true,
  spPictureContentList: [],
  sellAttributes: [],
  sellAttributesValueMap: {},
  normalAttributes: [],
  normalAttributesValueMap: {},
  sellStatus: PRODUCT_SELL_STATUS.ON,
  preSale: {
    saleType: PRODUCT_SALE_TYPE.NORMAL
  }
})

/**
 * 默认的context格式，接口获取的context会覆盖此context，但是是merge而不是replace
 */
export const getContext = () => ({
  field: {
    // upc
    [SPU_FIELD.UPC_CODE]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 名称
    [SPU_FIELD.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        placeholder: '请输入45字以内',
        max: 45 // 最多输入45个字
      },
      description: {
        // 描述
        message: ['建议命名形式为“品牌+品名+售卖规格”，示例: 农夫山泉 天然水 500ml/瓶。规范命名有利于提升销量 '],
        // 引导链接
        link: {
          href: 'http://collegewm.meituan.com/sg/post/detail?id=144&contentType=0',
          target: '_blank',
          text: '查看命名规范'
        }
      }
    },
    // 后台类目
    [SPU_FIELD.CATEGORY]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 店内分类
    [SPU_FIELD.TAG_LIST]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 是否医保商品
    [SPU_FIELD.IS_MEDICARE]: {
      required: true,
      disabled: true,
      visible: false,
      options: {
        placeholder: '',
        max: 1 // 最多输入36个字
      }
    },
    // 商品图片
    [SPU_FIELD.PICTURE_LIST]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        max: 8, // 图片最多多少张
        minWidth: 600, // 图片最小宽度
        aspectRatios: [{ // 图片支持的比例
          label: '1 : 1',
          value: 1
        }, {
          label: '4 : 3',
          value: 4 / 3
        }]
      },
      // 因为 description 和配置的 aspectRatios、minWidth、max相关，所以配置了函数
      description: (context) => {
        const { max, aspectRatios, minWidth } = context.options || {}
        const size = aspectRatios.map(({ label, value }) => {
          return `${label}（${minWidth}px*${minWidth / value}px）`
        })
        return {
          message: [`图片支持${size.join(' / ')}，最多上传${max}张图`, '高质量图片有利于提升销量'],
          link: {
            href: 'http://collegewm.meituan.com/post/detail/1415',
            target: '_blank',
            text: '查看详细说明'
          }
        }
      }
    },
    // 商品营销首图
    [SPU_FIELD.MARKETING_PICTURE]: {
      required: false,
      disabled: false,
      visible: false,
      options: {
        max: 1, // 图片最多多少张
        minWidth: 600, // 图片最小宽度
        aspectRatios: [{ // 图片支持的比例
          label: '1 : 1',
          value: 1
        }, {
          label: '4 : 3',
          value: 4 / 3
        }]
      },
      // 因为 description 和配置的 aspectRatios、minWidth、max相关，所以配置了函数
      description: (context) => {
        const { max, aspectRatios, minWidth } = context.options || {}
        const size = aspectRatios.map(({ label, value }) => {
          return `${label}（${minWidth}px*${minWidth / value}px）`
        })
        return {
          message: [`图片支持${size.join(' / ')}，仅可上传${max}张`]
        }
      }
    },
    // 商品视频
    [SPU_FIELD.PRODUCT_VIDEO]: {
      required: false,
      disabled: false,
      visible: false,
      description: {
        message: [
          '视频尺寸建议为1:1、3:4、16:9，支持上传200MB以内.mp4(推荐)/.mov/.wmv/.avi/.mpg/.mpeg等格式视频。',
          '封面视频可使顾客更好地了解商品，进而提升商品销量'
        ]
      }
    },
    // 商品条码图
    [SPU_FIELD.UPC_IMAGE]: {
      required: true,
      disabled: false,
      visible: false,
      description: '此类目商品需审核，请上传1张带有条形码的商品图(此图仅用于商品审核、不对商家展示)。'
    },
    // 商品限购
    [SPU_FIELD.LIMIT_SALE]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 商品属性
    [SPU_FIELD.ATTRIBUTE_LIST]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 商品售卖时间
    [SPU_FIELD.SALE_TIME]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 商品运费模板
    [SPU_FIELD.FREIGHT_TEMPLATE]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 商品标签：力荐
    [SPU_FIELD.LABEL_LIST]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 商品文字描述
    [SPU_FIELD.DESCRIPTION]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 商品图片详情
    [SPU_FIELD.PICTURE_CONTENT]: {
      required: false,
      disabled: false,
      visible: false,
      description: {
        message: ['建议图片宽度≥640像素、高度≤960像素; 单张图片2M以内, 最多可上传20张。'],
        placement: 'top'
      }
    },
    // 品牌图片详情
    [SPU_FIELD.SP_PICTURE_CONTENT]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 品牌商视频
    [SPU_FIELD.PRODUCT_SP_VIDEO]: {
      required: false,
      disabled: false,
      visible: false
    },
    // 类目属性
    [SPU_FIELD.CATEGORY_ATTRS]: {
      required: false,
      disabled: false,
      visible: true
    },
    // sku
    [SPU_FIELD.SKU_LIST]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 商品上/下架
    [SPU_FIELD.SELL_STATUS]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 售卖方式
    [SPU_FIELD.SALE_TYPE]: {
      required: false,
      disabled: false,
      visible: true
    }
  },
  // sku字段
  skuField: {
    // 规格
    [SKU_FIELD.SPEC_NAME]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 价格
    [SKU_FIELD.PRICE]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 库存
    [SKU_FIELD.STOCK]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 重量
    [SKU_FIELD.WEIGHT]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 最小购买量
    [SKU_FIELD.MIN_ORDER_COUNT]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 包装袋
    [SKU_FIELD.BOX]: {
      required: false,
      disabled: false,
      visible: true
    },
    // SKU码/货号
    [SKU_FIELD.SOURCE_FOOD_CODE]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 条形码
    [SKU_FIELD.UPC_CODE]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 货架码/位置码
    [SKU_FIELD.SHELF_NUM]: {
      required: false,
      disabled: false,
      visible: true
    },
    // 建议零售价
    [SKU_FIELD.SUGGESTED_PRICE]: {
      required: false,
      disabled: false,
      visible: false
    }
  },
  features: {
    spuId: 0,
    navigation: false,
    excludeDisableFields: [], // 排除锁定的字段
    excludeInvisibleFields: [], // 排除字段的不可见状态
    allowErrorRecovery: false, // 字段更新 是否允许纠错
    allowAttrApply: false, // 是否允许属性申请
    allowBrandApply: true, // 是否允许品牌申请
    allowAddSpec: false, // 多sku
    allowMultiProductTag: false, // 多分类
    propertyEditLock: false, // 字段锁定
    showCellularTopSale: false, // 商品库弹框是否展示区域热卖tab
    allowSuggestCategory: true, // 类目推荐
    supportLimitSaleMultiPoi: false, // 限购是否支持拓展到多店，商家商品库中心特殊功能
    disabledExistSkuColumnMap: {} // 已存在的sku不可以编辑的字段，商家商品库中心特殊功能
  }
})
