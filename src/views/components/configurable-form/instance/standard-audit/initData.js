import { SKU_FIELD, SPU_FIELD } from '../../field'

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
  field: {
    [SPU_FIELD.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        placeholder: '请输入36字以内',
        max: 36
      },
      description: '标题由“[品牌]+通用名+规格”组成，示例：[同仁堂]六味地黄丸360丸/盒'
    },
    [SPU_FIELD.CATEGORY]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SPU_FIELD.PICTURE_LIST]: {
      required: true,
      disabled: false,
      visible: true,
      description: '图片尺寸800px*800px，大小不超过1M，格式支持jpg，最多可上传8张',
      options: {
        showDescription: false,
        minWidth: 800,
        aspectRatios: [{
          label: '1 : 1',
          value: 1
        }]
      }
    },
    [SPU_FIELD.PICTURE_CONTENT]: {
      required: false,
      disabled: false,
      visible: true,
      description: {
        message: ['建议图片宽度≥640像素，高度≤960像素；单张图片≤2M，最多上传20张图片；'],
        placement: 'top'
      }
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
    }
  },
  skuField: {
    [SKU_FIELD.SPEC_NAME]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.UPC_CODE]: {
      required: true,
      disabled: false,
      visible: true
    },
    [SKU_FIELD.SUGGESTED_PRICE]: {
      required: true,
      disabled: false,
      visible: true
    }
  },
  features: {
    allowAttrApply: false,
    allowAddSpec: false
  }
})
