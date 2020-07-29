import {
  SELLING_TIME_TYPE,
  PRODUCT_SELL_STATUS
} from '@/data/enums/product'
import moment from 'moment'
import { SKU_FIELD, SPU_FIELD } from '../../field'

export const getProduct = () => ({
  upcCode: '',
  spId: 0,
  isSp: false,
  name: '',
  category: {},
  tagList: [],
  pictureList: [],
  upcImage: '',
  video: null,
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
  pictureContentList: [],
  spPictureContentSwitch: false,
  spPictureContentList: [],
  categoryAttrList: [],
  categoryAttrValueMap: {},
  sellStatus: PRODUCT_SELL_STATUS.OFF
})

export const getContext = () => ({
  field: {
    [SPU_FIELD.UPC_CODE]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        placeholder: '请输入品牌+商品名称+售卖规格，如农夫山泉 天然水 500ml/1瓶',
        max: 30
      },
      description: {
        message: ['使用规范的格式填写有利于商品曝光，提高商品的订单量及活动参与量'],
        link: {
          href: 'http://collegewm.meituan.com/sg/post/detail?id=144&contentType=0',
          target: '_blank',
          text: '查看标题规范 >'
        }
      }
    },
    [SPU_FIELD.CATEGORY]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.TAG_LIST]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.PICTURE_LIST]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        minWidth: 600,
        aspectRatios: [{
          label: '1 : 1',
          value: 1
        }, {
          label: '4 / 3',
          value: 4 / 3
        }]
      },
      description: {
        message: ['图片支持1:1（600px*600px）/ 4:3（600px*450px），最多上传8张图'],
        link: {
          href: 'http://collegewm.meituan.com/post/detail/1415',
          target: '_blank',
          text: '查看详细说明 >'
        }
      }
    },
    [SPU_FIELD.PRODUCT_VIDEO]: {
      required: false,
      disabled: false,
      visible: false,
      description: {
        message: [
          '视频尺寸建议为1:1或16:9，支持上传200MB以内.mp4(推荐)/.mov/.wmv/.avi/.mpg/.mpeg等格式视频。',
          '封面视频可使顾客更好地了解商品，进而提升商品销量'
        ]
      }
    },
    [SPU_FIELD.UPC_IMAGE]: {
      required: true,
      disabled: false,
      visible: false,
      description: '此类目商品需审核，请上传1张带有条形码的商品图（此图仅用于商品审核、不对商家展示）。'
    },
    [SPU_FIELD.LIMIT_SALE]: {
      required: false,
      disabled: false,
      visible: false
    },
    [SPU_FIELD.ATTRIBUTE_LIST]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.SALE_TIME]: {
      required: false,
      disabled: false,
      visible: false
    },
    [SPU_FIELD.LABEL_LIST]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.DESCRIPTION]: {
      required: false,
      disabled: false,
      visible: false
    },
    [SPU_FIELD.PICTURE_CONTENT]: {
      required: false,
      disabled: false,
      visible: false,
      description: {
        message: ['建议图片宽度≥640像素、高度≤960像素; 单张图片2M以内, 最多可上传20张。'],
        placement: 'top'
      }
    },
    [SPU_FIELD.SP_PICTURE_CONTENT]: {
      required: false,
      disabled: false,
      visible: false
    },
    [SPU_FIELD.CATEGORY_ATTRS]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.SKU_LIST]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.SELL_STATUS]: {
      required: false,
      disabled: false,
      visible: true
    }
  },
  skuField: {
    [SKU_FIELD.SPEC_NAME]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.PRICE]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.STOCK]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.WEIGHT]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.MIN_ORDER_COUNT]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.BOX]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.SOURCE_FOOD_CODE]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.UPC_CODE]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.SHELF_NUM]: {
      required: false,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.SUGGESTED_PRICE]: {
      required: false,
      disabled: false,
      visible: false
    }
  },
  features: {
    allowErrorRecovery: false, // 字段更新 是否允许纠错
    allowAttrApply: false, // 是否允许属性申请
    allowAddSpec: false, // 多sku
    allowMultiProductTag: false, // 多分类
    propertyEditLock: false, // 字段锁定
    showCellularTopSale: false, // 商品库弹框是否展示区域热卖tab
    allowSuggestCategory: true, // 类目推荐
    supportLimitSaleMultiPoi: false, // 限购是否支持拓展到多店，商家商品库中心特殊功能
    disabledExistSkuColumnMap: {} // 已存在的sku不可以编辑的字段，商家商品库中心特殊功能
  }
})
