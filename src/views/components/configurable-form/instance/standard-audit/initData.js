import { SKU_FELID, SPU_FELID } from '../../felid'

export const getProduct = () => ({
  name: '',
  category: {},
  pictureList: [],
  skuList: [],
  pictureContentList: [],
  spPictureContentSwitch: false,
  spPictureList: [],
  categoryAttrList: [],
  categoryAttrValueMap: {}
})

export const getContext = () => ({
  disabled: false,
  felid: {
    [SPU_FELID.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      max: 36
    },
    [SPU_FELID.CATEGORY]: {
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
        autoCropArea: 1,
        aspectRatios: [{
          label: '1 : 1',
          value: 1
        }]
      }
    },
    [SPU_FELID.PICTURE_CONTENT]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FELID.CATEGORY_ATTRS]: {
      required: true,
      disabled: false,
      visible: true
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
    [SKU_FELID.STOCK]: {
      required: true,
      visible: true
    },
    [SKU_FELID.PRICE]: {
      required: true,
      visible: true
    }
  },
  features: {
    multiSku: false // TODO 添加规格，只对没有销售属性的情况起作用
  }
})
