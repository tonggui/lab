/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
import { isEmpty } from '@/common/utils'
import validate from './validate'
import createCategoryAttrsConfigs from './components/category-attrs/config'

export default () => {
  return [
    {
      layout: 'FormCard',
      options: {
        style: {
          paddingBottom: '10px'
        },
        title: '基本信息'
      },
      children: [
        {
          key: 'category',
          type: 'CategoryPath',
          label: '后台类目',
          value: {},
          // disabled: true,
          required: true,
          validate ({ key, value, required }) {
            const poiType = this.getContext('poiType')
            return validate(key, value, { required, poiType })
          }
        },
        {
          key: 'upcCode',
          type: 'Input',
          label: 'UPC码',
          value: '',
          // disabled: true,
          required: true
        },
        {
          key: 'name',
          type: 'Input',
          label: '药品名称',
          required: true,
          value: ''
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
          validate ({ type, label, value = [], required }) {
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
              'options.source' () {
                return this.getContext('tagList') || []
              }
            }
          }
        },
        {
          key: 'spec',
          type: 'Input',
          label: '规格',
          required: true,
          value: ''
        },
        {
          key: 'sourceFoodCode',
          type: 'Input',
          label: 'SKU码/货号',
          value: '',
          events: {
            change (val) {
              this.setData('sourceFoodCode', val)
            }
          }
        },
        {
          key: 'sellStatus',
          type: 'SellStatus',
          label: '售卖状态',
          required: true,
          value: -1,
          events: {
            change (val) {
              this.setData('sellStatus', val)
            }
          }
        },
        {
          key: 'suggestPrice',
          type: 'Input',
          label: '指导价',
          required: true,
          value: 0,
          children: [
            {
              type: 'span',
              slotName: 'append',
              children: ['元']
            }
          ],
          events: {
            change (val) {
              this.setData('suggestPrice', val)
            }
          }
        },
        {
          key: 'price',
          type: 'Input',
          label: '价格',
          required: true,
          value: 0,
          children: [
            {
              type: 'span',
              slotName: 'append',
              children: ['元']
            }
          ],
          events: {
            change (val) {
              this.setData('price', val)
            }
          }
        },
        {
          key: 'stock',
          type: 'Input',
          label: '库存',
          required: true,
          value: 0,
          events: {
            change (val) {
              this.setData('stock', val)
            }
          }
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          disabled: true,
          options: {
            showDescription: false
          },
          validate ({ key, value, required }) {
            const poiType = this.getContext('poiType')
            return validate(key, value, { required, poiType })
          },
          value: [],
          rules: {
            result: {
              'options.keywords' () {
                return this.getData('name')
              },
              'options.poorList' () {
                return this.getData('poorPictureList')
              }
            }
          }
        }
      ]
    },
    {
      layout: 'FormCard',
      options: {
        title: '其他信息',
        style: {
          paddingBottom: '20px'
        }
      },
      children: [
        {
          key: 'normalAttributesValueMap',
          type: 'CategoryAttrs',
          layout: null,
          label: '',
          options: {
            allowApply: false
          },
          value: {},
          rules: {
            result: {
              // 监听类目属性变化
              attrs () {
                const attrs = this.getContext('normalAttributes')
                const allowApply = !!this.getContext('modules').allowApply
                const configs = createCategoryAttrsConfigs('normalAttributesValueMap', attrs, { allowApply })
                this.replaceConfigChildren('normalAttributesValueMap', {
                  type: 'div',
                  layout: null,
                  slotName: 'attrs',
                  options: {
                    class: attrs.length >= 4 ? 'row-mode' : 'column-mode'
                  },
                  children: configs
                })
              },
              'options.allowApply' () {
                return this.getContext('modules').allowApply
              }
            }
          }
        }
      ],
      rules: [
        {
          result: {
            mounted () {
              const attrs = this.getContext('normalAttributes')
              return !!(attrs && attrs.length)
            }
          }
        }
      ]
    }
  ]
}
