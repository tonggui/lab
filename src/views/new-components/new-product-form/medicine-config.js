/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
import moment from 'moment'
import { MEDICINE_MAX_STOCK } from '@/data/constants/product'
import { isEmpty } from '@/common/utils'
import validate from '@/views/components/product-form/validate'
import createCategoryAttrsConfigs from '@/views/components/product-form/components/category-attrs/config'
import lx from '@/common/lx/lxReport'
import {
  SELLING_TIME_TYPE
} from '@/data/enums/product'

const changeInfoKeyMap = {
  MEDICINE_UPC: 'upcCode',
  MEDICINE_NAME: 'name',
  MEDICINE_SPEC: 'spec',
  MEDICINE_SUGGESTED_PRICE: 'suggestedPrice',
  MEDICINE_PICTURE: 'pictureList'
}

export default () => {
  return [
    {
      type: 'SpChangeInfo',
      layout: null,
      value: false,
      options: {
        changes: {},
        product: {},
        categoryAttrList: [],
        warningText: '如价格与商品不对应，请替换商品后立即修改价格'
      },
      events: {
        confirm (type, basicChanges = [], categoryAttrChanges = []) {
          const id = this.getData('id')
          lx.mc({ bid: 'b_shangou_online_e_igr1pn6t_mc', val: { op_type: type, spu_id: id || 0 } })
          this.setContext('spChangeInfoDecision', type)
          if (type !== 1) {
            return
          }
          basicChanges.forEach(c => {
            this.setData(changeInfoKeyMap[c.field], c.newValue)
          })
          categoryAttrChanges.forEach(c => {
            this.setData(`categoryAttrValueMap.${c.id}`, c.newValue)
          })
        }
      },
      rules: {
        result: {
          'options.changes' () {
            return this.getContext('changeInfo')
          },
          'options.product' () {
            return {
              price: this.getData('price')
            }
          },
          'options.categoryAttrList' () {
            return this.getContext('categoryAttrList')
          },
          'options.value' () {
            const { basicInfoList = [], categoryAttrInfoList = [] } = this.getContext('changeInfo')
            return !!(basicInfoList.length || categoryAttrInfoList.length)
          }
        }
      }
    },
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
          },
          validate ({ value }) {
            return validate('sku.price', value)
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
          },
          validate ({ value }) {
            if (value > MEDICINE_MAX_STOCK) {
              return `库存不能大于${MEDICINE_MAX_STOCK}`
            }
            return validate('sku.stock', value)
          }
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          disabled: true,
          options: {
            showDescription: false,
            size: 'large'
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
        },
        {
          key: 'spPictureContentSwitch',
          type: 'SpPicDetails',
          label: '品牌商图片详情',
          value: false,
          mounted: false,
          options: {
            size: 'large',
            description: '',
            tips: '该图片会展示到买家端的商品详情中，便于买家更直观了解商品，有利于提升商品销量。（图片来源于平台商品库，由品牌商提供）',
            pictureList: [],
            style: {
              paddingTop: '11px'
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  const spPictureContentList = this.getData('spPictureContentList')
                  return !!(spPictureContentList && spPictureContentList.length)
                },
                'options.pictureList' () {
                  return this.getData('spPictureContentList')
                }
              }
            }
          ]
        },
        {
          key: 'limitSale',
          type: 'PurchaseLimitation',
          label: ({
            render () {
              return (
                <span>
                  限制购买
                  <Tooltip
                    style="margin-left: 2px"
                    transfer
                    placement="right"
                    width="225px"
                    content="针对特殊商品，需要限制每个买家在周期内可购买的数量时，可以开启限购"
                  >
                    <Icon class="tip" local="question-circle"/>
                  </Tooltip>
                </span>
              )
            }
          }),
          value: {
            status: 0,
            rule: 1,
            range: [moment().format('YYYY-MM-DD'), moment().add(29, 'd').format('YYYY-MM-DD')],
            max: 0
          },
          events: {
            'change' (v) {
              this.setData('limitSale', v)
            }
          },
          validate ({ value }) {
            const { status = 0, range = [], rule, max = 0 } = value
            if (!status) return '' // 不限制的话不进行校验
            if (!range.length || range.some(v => !v)) return '限购周期不能为空'
            if (!rule) return '请选择限购规则'
            if (max < 1) return '限购数量必须>=1'
          },
          rules: {
            result: {
              mounted () {
                return !!this.getContext('modules').limitSale
              }
            }
          }
        },
        {
          key: 'shippingTime',
          type: 'SaleTime',
          label: '可售时间',
          value: {
            type: SELLING_TIME_TYPE.Infinite
          },
          events: {
            'on-change' (val) {
              this.setData('shippingTime', val)
            }
          },
          rules: {
            result: {
              visible () {
                return this.getContext('modules').sellTime !== false
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
                const configs = createCategoryAttrsConfigs('categoryAttrValueMap', attrs, { isMedicine: true, disabled: true })
                this.replaceConfigChildren('categoryAttrValueMap', {
                  type: 'div',
                  layout: null,
                  options: {
                    class: attrs.length >= 4 ? 'row-mode' : 'column-mode'
                  },
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
