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
          disabled: true,
          required: true
        },
        {
          key: 'upcCode',
          type: 'Input',
          label: 'UPC码',
          value: '',
          disabled: true,
          required: true
        },
        {
          key: 'name',
          type: 'Input',
          label: '药品名称',
          disabled: true,
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
          disabled: true,
          required: true,
          value: ''
        },
        {
          key: 'sourceFoodCode',
          type: 'Input',
          label: 'SKU码/货号',
          value: '',
          events: {
            'on-change' (e) {
              this.setData('sourceFoodCode', e.target.value)
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
          key: 'suggestedPrice',
          type: 'Input',
          label: '指导价',
          disabled: true,
          required: true,
          value: undefined,
          children: [
            {
              type: 'span',
              slotName: 'append',
              children: ['元']
            }
          ]
        },
        {
          key: 'price',
          type: 'Input',
          label: '价格',
          required: true,
          value: undefined,
          children: [
            {
              type: 'span',
              slotName: 'append',
              children: ['元']
            }
          ],
          events: {
            'on-change' (e) {
              this.setData('price', e.target.value)
            }
          }
        },
        {
          key: 'stock',
          type: 'Input',
          label: '库存',
          required: true,
          value: undefined,
          events: {
            'on-change' (e) {
              this.setData('stock', e.target.value)
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
          key: 'categoryAttrValueMap',
          type: 'CategoryAttrs',
          layout: null,
          label: '',
          value: {},
          rules: {
            result: {
              // 监听类目属性变化
              attrs () {
                const attrs = this.getContext('categoryAttrList')
                const configs = createCategoryAttrsConfigs('categoryAttrValueMap', attrs, { isMedicine: true })
                this.replaceConfigChildren('categoryAttrValueMap', {
                  type: 'div',
                  layout: null,
                  slotName: 'attrs',
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
              const attrs = this.getContext('categoryAttrList')
              return !!(attrs && attrs.length)
            }
          }
        }
      ]
    }
  ]
}
