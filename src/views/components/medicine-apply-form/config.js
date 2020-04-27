/*
 * @description
 *   Please write the config.js script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2020/4/1)
 */

import pick from 'lodash/pick'
import isPlainObject from 'lodash/isPlainObject'
import { fetchGetMedicineTagList } from '@/data/repos/category'
import { fetchGetMedicineCategoryAttrList } from '@/data/repos/medicine'
import { isEmpty } from '@/common/utils'
import createCategoryAttrsConfigs from '@/views/components/product-form/components/category-attrs/config'
import { splitCategoryAttrMap } from '@/views/components/product-form/data'

const updateCategoryAttrByCategoryId = function (categoryId) {
  const oldPrimaryAttributesValueMap = this.getData('primaryAttributesValueMap')
  const oldNormalAttributesValueMap = this.getData('normalAttributesValueMap')
  if (categoryId) {
    fetchGetMedicineCategoryAttrList(undefined, categoryId, true).then(attrs => {
      const {
        normalAttributes,
        normalAttributesValueMap
      } = splitCategoryAttrMap(attrs, { ...oldNormalAttributesValueMap, ...oldPrimaryAttributesValueMap })
      const primaryAttributeList = normalAttributes.filter(attr => attr.attrType === 1)
      const normalAttributeList = normalAttributes.filter(attr => attr.attrType === 3)
      this.setData('primaryAttributeList', primaryAttributeList)
      this.setData('primaryAttributesValueMap', pick(normalAttributesValueMap, primaryAttributeList.map(attr => attr.id)))
      this.setData('normalAttributeList', normalAttributeList)
      this.setData('normalAttributesValueMap', pick(normalAttributesValueMap, normalAttributeList.map(attr => attr.id)))
    })
  } else {
    this.setData('primaryAttributeList', [])
    this.setData('primaryAttributesValueMap', {})
    this.setData('normalAttributeList', [])
    this.setData('normalAttributesValueMap', {})
  }
}

const isMedicine = () => true

const isDisabled = ctx => ctx.getContext('auditing') === true || ctx.getContext('auditApproved') === true

const attachRuleToConfig = (config, rule) => {
  if (!isPlainObject(config)) return
  if (config.rules) {
    if (Array.isArray(config.rules)) {
      config.rules.push(rule)
    } else {
      config.rules = [rule, config.rules]
    }
  } else {
    config.rules = rule
  }
  if (config.children && config.children.length) {
    config.children.map(item => attachRuleToConfig(item, rule))
  }
}

const globalDisabledRule = {
  result: {
    'options.disabled' () {
      return isDisabled(this)
    }
  }
}

export default () => {
  const formConfig = [
    {
      layout: 'FormCard',
      options: {
        title: '基本信息',
        tip: '药品基础信息，正确填写有利于促进购买转化',
        style: {
          paddingBottom: '10px'
        }
      },
      children: [
        {
          key: 'category',
          type: 'CategoryPath',
          label: '商品分类',
          value: {},
          required: true,
          display (v) {
            return (v.namePath || []).join(' > ')
          },
          options: {
            suggesting: false,
            placeholder: '请输入类目关键词，例如苹果',
            showProductList: false,
            supportLocked: false
          },
          events: {
            'on-change' (category) {
              this.setData('category', category)
              updateCategoryAttrByCategoryId.call(this, category.id)
            }
          }
        },
        {
          key: 'name',
          type: 'Input',
          label: '商品标题',
          required: true,
          value: '',
          description: '标题由“[品牌]+通用名+规格”组成，示例：[同仁堂]六味地黄丸360丸/盒',
          options: {
            clearable: true,
            placeholder: '请输入36个字以内',
            maxlength: 36
          },
          binding: true
        },
        {
          label: 'UPC/EAN',
          key: 'upcList',
          type: 'UpcList',
          value: [''],
          required: true,
          binding: true,
          showError: false, // Layout层面取消容器的错误显示
          emptyTip: false,
          options: {
            maxLength: 14,
            maxCount: 1
          },
          rules: {
            result: {
              'options.maxLength' () {
                return isMedicine(this) ? 20 : 14
              }
            }
          }
        },
        {
          label: '商品规格',
          key: 'spec',
          type: 'Input',
          required: true,
          value: '',
          description: '规格由含量和数量组成，示例：10g*12袋',
          binding: true,
          options: {
            clearable: true,
            placeholder: '请输入'
          }
        },
        {
          label: '指导价格',
          key: 'suggestedPrice',
          type: 'Input',
          required: true,
          value: '',
          binding: true,
          options: {
            clearable: true,
            placeholder: '请输入',
            validateType: 'positive_float_2'
          },
          children: [
            {
              type: 'span',
              slotName: 'prefix',
              children: ['¥']
            }
          ]
        },
        {
          key: 'tagList',
          type: 'TagList',
          label: '商品分类',
          required: true,
          value: [],
          options: {
            source: [],
            maxCount: 5,
            separator: ' > ',
            placeholder: '请输入或点击选择'
          },
          validate ({ label, value = [], required }) {
            if (required && isEmpty(value)) {
              throw new Error(`${label}不能为空`)
            }
          },
          events: {
            change (val = []) {
              this.setData('tagList', val)
            }
          },
          rules: {
            result: {
              async 'options.source' () {
                let tagList = []
                try {
                  tagList = await fetchGetMedicineTagList()
                } catch (e) {

                }
                return tagList
              }
            }
          }
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '商品图片',
          description: '图片尺寸800px*800px，大小不超过1M，格式支持jpg，最多可上传5张',
          required: true,
          options: {
            showDescription: false,
            autoCropArea: 1,
            minWidth: 800,
            aspectRatios: [{
              label: '1 : 1',
              value: 1
            }]
          },
          events: {
            change (v) {
              this.setData('pictureList', v)
            }
          },
          value: []
        },
        {
          key: 'pictureDetailList',
          type: 'PicDetails',
          label: '图片详情',
          value: [],
          description: '建议图片宽度≥640像素，高度≤960像素；单张图片≤2M，最多上传20张图片；',
          events: {
            change (v) {
              this.setData('pictureDetailList', v)
            }
          },
          validate ({ value = [] }) {
            if (value.length > 20) {
              return '图片详情最多只能上传20张图片'
            }
          }
        }
      ]
    },
    {
      layout: 'FormCard',
      options: {
        title: '关键属性',
        tip: '药品政策信息，请谨慎填写',
        style: {
          paddingBottom: '10px'
        }
      },
      children: [
        {
          key: 'primaryAttributesValueMap',
          type: 'div',
          layout: null,
          value: {},
          rules: {
            result: {
              attrs () {
                const attrs = this.getData('primaryAttributeList') || []
                const configs = createCategoryAttrsConfigs(
                  'primaryAttributesValueMap',
                  attrs,
                  { isMedicine: true, disabled: isDisabled(this) },
                  false
                )
                this.replaceConfigChildren('primaryAttributesValueMap', {
                  type: 'div',
                  layout: null,
                  options: {
                    class: attrs.length >= 4 ? 'row-mode' : 'column-mode'
                  },
                  children: configs
                })
              }
            }
          }
        }
      ],
      rules: [
        {
          result: {
            mounted () {
              const attrs = this.getData('primaryAttributeList')
              return !!(attrs && attrs.length)
            }
          }
        }
      ]
    },
    {
      layout: 'FormCard',
      options: {
        title: '普通属性',
        tip: '药品功能相关信息，请细致填写',
        style: {
          paddingBottom: '10px'
        }
      },
      children: [
        {
          key: 'normalAttributesValueMap',
          type: 'div',
          layout: null,
          value: {},
          rules: {
            result: {
              attrs () {
                const attrs = this.getData('normalAttributeList') || []
                const configs = createCategoryAttrsConfigs(
                  'normalAttributesValueMap',
                  attrs,
                  { isMedicine: true, disabled: isDisabled(this) },
                  false
                )
                this.replaceConfigChildren('normalAttributesValueMap', {
                  type: 'div',
                  layout: null,
                  options: {
                    class: attrs.length >= 4 ? 'row-mode' : 'column-mode'
                  },
                  children: configs
                })
              }
            }
          }
        }
      ],
      rules: [
        {
          result: {
            mounted () {
              const attrs = this.getData('normalAttributeList')
              return !!(attrs && attrs.length)
            }
          }
        }
      ]
    }
  ]
  // 附加锁定规则逻辑
  formConfig.map(config => attachRuleToConfig(config, globalDisabledRule))
  return formConfig
}
