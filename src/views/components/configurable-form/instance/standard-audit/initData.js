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
  felid: {
    [SPU_FELID.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        placeholder: '请输入36字以内',
        max: 36
      },
      description: '标题由“[品牌]+通用名+规格”组成，示例：[同仁堂]六味地黄丸360丸/盒'
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
      description: '图片尺寸800px*800px，大小不超过1M，格式支持jpg，最多可上传8张',
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
      visible: true,
      description: {
        message: ['建议图片宽度≥640像素，高度≤960像素；单张图片≤2M，最多上传20张图片；'],
        placement: 'top'
      }
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
      required: true,
      visible: true
    },
    [SKU_FELID.UPC_CODE]: {
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
