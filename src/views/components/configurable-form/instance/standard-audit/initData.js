import { SKU_FIELD, SPU_FIELD } from '../../field'

export const getProduct = () => ({
  name: '',
  category: {},
  pictureList: [],
  skuList: [],
  pictureContentList: [],
  spPictureContentSwitch: false,
  spPictureList: [],
  normalAttributes: [],
  normalAttributesValueMap: {}
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
      options: {
        showDescription: false,
        max: 5,
        minWidth: 800,
        aspectRatios: [{
          label: '1 : 1',
          value: 1
        }]
      },
      description: (context) => {
        const { max = 5, aspectRatios, minWidth } = context.options || {}
        const size = aspectRatios.map(({ label, value }) => {
          return `${label}（${minWidth}px*${minWidth / value}px）`
        })
        return {
          message: [`图片支持${size.join(' / ')}，最多上传${max}张图`, '高质量图片有利于提升销量'],
          link: {
            href: 'http://collegewm.meituan.com/post/detail/1415',
            target: '_blank',
            text: '查看详细说明 >'
          }
        }
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
