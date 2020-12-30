import { SKU_FIELD, SPU_FIELD } from '../../field'

/* 药品标品纠错默认兜底数据 */
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

/**
 * 药品标品纠错默认的context格式，接口获取的context会覆盖此context，但是是merge而不是replace
 */
export const getContext = () => ({
  field: {
    // 商品名称
    [SPU_FIELD.NAME]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        placeholder: '请输入36字以内',
        max: 36 // 最多输入36个字
      },
      description: '标题由“[品牌]+通用名+规格”组成，示例：[同仁堂]六味地黄丸360丸/盒'
    },
    // 后台类目
    [SPU_FIELD.CATEGORY]: {
      required: true,
      disabled: false,
      visible: true
    },
    // 商品图片
    [SPU_FIELD.PICTURE_LIST]: {
      required: true,
      disabled: false,
      visible: true,
      options: {
        showDescription: false,
        max: 8,
        minWidth: 800,
        aspectRatios: [{
          label: '1 : 1',
          value: 1
        }]
      },
      description: (context) => {
        const { max = 8, aspectRatios, minWidth } = context.options || {}
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
    // 图片详情
    [SPU_FIELD.PICTURE_CONTENT]: {
      required: false,
      visible: true,
      description: {
        message: ['建议图片宽度≥640像素，高度≤960像素；单张图片≤2M，最多上传20张图片；'],
        placement: 'top'
      }
    },
    // 类目属性
    [SPU_FIELD.CATEGORY_ATTRS]: {
      required: false,
      disabled: false,
      visible: true
    },
    // sku，仅支持1条
    [SPU_FIELD.SKU_LIST]: {
      required: false,
      disabled: false,
      visible: true
    }
  },
  skuField: {
    // 规格名称
    [SKU_FIELD.SPEC_NAME]: {
      required: true,
      disabled: false,
      visible: true
    },
    // upc
    [SKU_FIELD.UPC_CODE]: {
      required: true,
      visible: true
    },
    // 建议零售价
    [SKU_FIELD.SUGGESTED_PRICE]: {
      required: true,
      visible: true
    }
  },
  features: {
    allowAttrApply: false, // 不支持属性申请
    allowAddSpec: false // 不支持多规格
  },
  categoryFieldConfig: [] // 类目属性中不可编辑项的ID
})
