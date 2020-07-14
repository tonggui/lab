import {
  SELLING_TIME_TYPE
} from '@/data/enums/product'
import moment from 'moment'
import { SKU_FELID, SPU_FELID } from '../../felid'

export const getProduct = () => ({
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
  spPictureList: [],
  categoryAttrList: [],
  categoryAttrValueMap: {}
})

export const getContext = () => ({
  felid: {
    [SPU_FELID.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      max: 36, // TODO
      description: {
        message: ['使用规范的格式填写有利于商品曝光，提高商品的订单量及活动参与量'],
        link: {
          href: 'http://collegewm.meituan.com/sg/post/detail?id=144&contentType=0',
          target: '_blank',
          text: '查看标题规范 >'
        }
      }
    },
    [SPU_FELID.CATEGORY]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FELID.TAG_LIST]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FELID.PICTURE_LIST]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        minWidth: 800,
        aspectRatios: [{
          label: '1 : 1',
          value: 1
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
    [SPU_FELID.PRODUCT_VIDEO]: {
      required: true,
      disabled: false,
      visible: false,
      description: {
        message: [
          '视频尺寸建议为1:1或16:9，支持上传200MB以内.mp4(推荐)/.mov/.wmv/.avi/.mpg/.mpeg等格式视频。',
          '封面视频可使顾客更好地了解商品，进而提升商品销量'
        ]
      }
    },
    [SPU_FELID.UPC_IMAGE]: {
      required: true,
      disabled: false,
      visible: false,
      description: '此类目商品需审核，请上传1张带有条形码的商品图（此图仅用于商品审核、不对商家展示）。'
    },
    [SPU_FELID.LIMIT_SALE]: {
      required: true,
      disabled: false,
      visible: false
    },
    [SPU_FELID.ATTRIBUTE_LIST]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FELID.SALE_TIME]: {
      required: true,
      disabled: false,
      visible: false
    },
    [SPU_FELID.LABEL_LIST]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FELID.DESCRIPTION]: {
      required: true,
      disabled: false,
      visible: false
    },
    [SPU_FELID.PICTURE_CONTENT]: {
      required: true,
      disabled: false,
      visible: false,
      description: {
        message: ['建议图片宽度≥640像素、高度≤960像素; 单张图片2M以内, 最多可上传20张。'],
        placement: 'top'
      }
    },
    [SPU_FELID.SP_PICTURE_CONTENT]: {
      required: true,
      disabled: false,
      visible: false
    },
    [SPU_FELID.CATEGORY_ATTRS]: {
      required: true,
      disabled: false,
      visible: false
    },
    [SPU_FELID.SKU_LIST]: {
      required: true,
      disabled: false,
      visible: true
    }
  },
  skuFelid: {
    [SKU_FELID.SPEC_NAME]: {
      required: false,
      visible: true
    },
    [SKU_FELID.PRICE]: {
      required: true,
      visible: true
    },
    [SKU_FELID.STOCK]: {
      required: true,
      visible: true
    },
    [SKU_FELID.WEIGHT]: {
      required: true, // TODO 白名单
      visible: true
    },
    [SKU_FELID.MIN_ORDER_COUNT]: {
      required: true,
      visible: true
    },
    [SKU_FELID.BOX]: {
      required: false,
      visible: true
    },
    [SKU_FELID.SOURCE_FOOD_CODE]: {
      required: false,
      visible: true
    },
    [SKU_FELID.UPC_CODE]: {
      required: true, // TODO 白名单
      visible: true
    },
    [SKU_FELID.SHELF_NUM]: {
      required: false,
      visible: true
    },
    [SKU_FELID.SUGGESTED_PRICE]: {
      required: false,
      visible: false
    }
  },
  state: {
    normalAttributes: [], // 类目属性
    sellAttributes: [] // 销售属性
  },
  features: {
    allowAttrApply: true, // TODO 属性申请
    allowBrandApply: true, // TODO 品牌申请
    shortCut: true, // TODO 快捷新建
    multiSku: true, // TODO 添加规格，只对没有销售属性的情况起作用
    multiTag: false, // TODO 多分类
    propertyLock: false, // TODO 字段锁定
    // isBatch: false, // TODO 是否是批量单个新建商品，批量使用TagInput
    // showSpListModal: false, // TODO 是否展示商品库弹框
    // showCellularTopSale: false, // TODO 商品库弹框是否展示区域热卖tab
    // allowSuggestCategory: false, // TODO 类目推荐
    // upcExisted: false, // TODO 是否存在upc
    // needAudit: false, // TODO 是否需要审核
    // supportLimitSaleMultiPoi: false, // TODO 限购是否支持拓展到多店
    // propertyLock: false, // TODO 字段锁定
    // isManager: false, // TODO 是否是审核运营端
    // managerEdit: false, // TODO 审核运营端是否支持编辑
    disabledExistSkuColumnMap: {
      [SKU_FELID.PRICE]: true,
      [SKU_FELID.STOCK]: false
    } // 已存在的sku不可以编辑的字段
  }
})
