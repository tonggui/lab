/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
import { assignToSealObject } from '@/components/dynamic-form/util'
import { isEmpty } from '@/common/utils'
import validate from './validate'
import { fetchGetCategoryAttrList } from '@/data/repos/category'
import {
  splitCategoryAttrMap
} from './data'

const computeNodeRule = (rules, key, isSp) => ({
  required: rules.required[key],
  editable: (isSp ? rules.spEditable : rules.editable)[key]
})

const computeProduct = (product, rules, key) => {
  const isSp = product.isSp
  const isConnected = product.spId > 0
  if (key) {
    return {
      isSp,
      isConnected,
      rule: computeNodeRule(rules, key, isSp)
    }
  } else {
    return { isSp, isConnected }
  }
}

const updateProductBySp = (product, sp) => {
  console.log({ ...product }, { ...sp })
  assignToSealObject(product, {
    ...sp,
    id: product.id,
    spId: sp.id
  })
}

export default () => {
  return [
    {
      key: 'layout1',
      layout: 'FormCard',
      title: '快捷新建',
      children: [
        {
          key: 'upcCode',
          layout: null,
          type: 'ChooseProduct',
          value: '',
          options: {
            batch: true,
            style: 'padding: 0 20px 20px;',
            placeholder: undefined
          },
          events: {
            'on-change' (upc) {
              this.formData.upcCode = upc
            },
            'on-select-product' (product) {
              if (product) {
                const {
                  normalAttributes,
                  normalAttributesValueMap,
                  sellAttributes,
                  sellAttributesValueMap
                } = splitCategoryAttrMap(product.categoryAttrList, product.categoryAttrValueMap)
                this.formData.normalAttributesValueMap = normalAttributesValueMap
                this.formData.sellAttributesValueMap = sellAttributesValueMap
                this.context.normalAttributes = normalAttributes
                this.context.sellAttributes = sellAttributes
                updateProductBySp(this.formData, product)
              }
            }
          },
          rules: [
            {
              result: {
                'options.noUpc' () {
                  return this.context.modules.suggestNoUpc === true
                }
              }
            }
          ]
        }
      ],
      rules: [
        {
          result: {
            title () {
              return `快捷${this.context.modeString}`
            },
            tip () {
              return `提高${this.context.modeString}商品效率`
            },
            mounted () {
              return this.context.modules.shortCut !== false
            }
          }
        }
      ]
    },
    {
      key: 'layout2',
      layout: 'FormCard',
      title: '基本信息',
      tip: '填写基本的商品信息，有利于增强商品流量，促进购买转换！',
      children: [
        {
          key: 'name',
          type: 'Input',
          label: '商品标题',
          required: true,
          description: ({
            render () {
              return (
                <span>
                  使用规范的格式填写有利于商品曝光，提高商品的订单量及活动参与量 <a href="http://collegewm.meituan.com/sg/post/detail?id=144&contentType=0" target="_blank">查看标题规范 &gt;</a>
                </span>
              )
            }
          }),
          value: '',
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          events: {
            'on-change' ($event) {
              this.formData.name = $event.target.value
            }
          },
          options: {
            clearable: true,
            placeholder: '请输入商品标题'
          },
          rules: [
            {
              result: {
                disabled () {
                  const { rule } = computeProduct(this.formData, this.context.whiteList, 'title')
                  return !rule.editable
                },
                required () {
                  const { rule } = computeProduct(this.formData, this.context.whiteList, 'title')
                  return rule.required
                }
              }
            }
          ]
        },
        {
          key: 'tagList',
          type: 'TagList',
          label: '店内分类',
          required: true,
          value: [],
          options: {
            source: [],
            maxCount: 1,
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
              this.formData.tagList = val
            }
          },
          rules: [
            {
              result: {
                'options.source' () {
                  return this.context.tagList
                },
                'options.maxCount' () {
                  return this.context.preferences.maxTagCount
                }
              }
            }
          ]
        },
        {
          key: 'category',
          type: 'CategoryPath',
          label: '商品类目',
          value: {},
          required: true,
          options: {
            placeholder: '请输入或点击选择'
          },
          events: {
            'on-change' (category) {
              this.formData.category = category
              if (this.context.categoryAttrSwitch) {
                if (category.id) {
                  fetchGetCategoryAttrList(category.id).then(attrs => {
                    const {
                      normalAttributes,
                      normalAttributesValueMap,
                      sellAttributes,
                      sellAttributesValueMap
                    } = splitCategoryAttrMap(attrs, { ...this.formData.normalAttributesValueMap, ...this.formData.sellAttributesValueMap })
                    if (sellAttributes.length > 0 || this.context.sellAttributes.length > 0) {
                      this.formData.skuList = [] // 清空sku
                    }
                    this.context.normalAttributes = normalAttributes
                    this.context.sellAttributes = sellAttributes
                    this.formData.normalAttributesValueMap = normalAttributesValueMap
                    this.formData.sellAttributesValueMap = sellAttributesValueMap
                    this.formData.categoryAttrList = attrs
                  })
                } else {
                  this.context.normalAttributes = []
                  this.context.sellAttributes = []
                  this.formData.normalAttributesValueMap = {}
                  this.formData.sellAttributesValueMap = {}
                  this.formData.categoryAttrList = []
                }
              }
            },
            'on-select-product' (product) {
              if (product) {
                const {
                  normalAttributes,
                  normalAttributesValueMap,
                  sellAttributes,
                  sellAttributesValueMap
                } = splitCategoryAttrMap(product.categoryAttrList, product.categoryAttrValueMap)
                this.formData.normalAttributesValueMap = normalAttributesValueMap
                this.formData.sellAttributesValueMap = sellAttributesValueMap
                this.context.normalAttributes = normalAttributes
                this.context.sellAttributes = sellAttributes
                updateProductBySp(this.formData, product)
              }
            }
          },
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          rules: [
            {
              result: {
                disabled () {
                  const { rule } = computeProduct(this.formData, this.context.whiteList, 'category')
                  return !rule.editable
                },
                required () {
                  const { rule } = computeProduct(this.formData, this.context.whiteList, 'category')
                  return rule.required
                }
              }
            }
          ]
        },
        {
          key: 'brand',
          type: 'Brand',
          label: '商品品牌',
          value: {},
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          events: {
            'on-change' (brand) {
              this.formData.brand = brand
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  return !this.context.categoryAttrSwitch
                },
                disabled () {
                  const { rule } = computeProduct(this.formData, this.context.whiteList, 'brand')
                  return !rule.editable
                },
                required () {
                  const { rule } = computeProduct(this.formData, this.context.whiteList, 'brand')
                  return rule.required
                }
              }
            }
          ]
        },
        {
          key: 'origin',
          type: 'Origin',
          label: '产地',
          value: {},
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          events: {
            change (origin) {
              this.formData.origin = origin
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  return !this.context.categoryAttrSwitch
                }
              }
            }
          ]
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          description: ({
            render () {
              return (
                <span>
                图片支持1:1（600px*600px）/ 4:3（600px*450px），最多上传5张图 <a href="http://collegewm.meituan.com/post/detail/1415" target="_blank">查看详细说明 &gt;</a>
                </span>
              )
            }
          }),
          value: [],
          options: {
            keywords: ''
          },
          events: {
            change (v) {
              this.formData.pictureList = v
            }
          },
          rules: [
            {
              result: {
                'options.keywords' () {
                  return this.formData.name
                }
              }
            }
          ]
        },
        {
          key: 'normalAttributesValueMap',
          type: 'CategoryAttrs',
          label: '',
          value: {},
          options: {
            attrs: []
          },
          events: {
            change (data) {
              this.formData.normalAttributesValueMap = data
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  return this.context.categoryAttrSwitch
                },
                'options.attrs' () {
                  return this.context.normalAttributes
                }
              }
            }
          ]
        }
      ]
    },
    {
      key: 'layout3',
      layout: 'FormCard',
      title: '售卖信息',
      tip: '填写售卖信息有助于买家更快的下单，库存为0的在买家端不展示',
      children: [
        {
          key: 'skuList',
          type: 'SellInfo',
          label: '',
          value: [],
          options: {
            attrList: [],
            selectAttrMap: {},
            whiteList: {},
            categoryAttrSwitch: false,
            supportPackingBag: true
          },
          rules: [
            {
              result: {
                'options.whiteList' () {
                  return this.context.whiteList
                },
                supportPackingBag () {
                  return !!this.context.modules.packingbag
                },
                'options.categoryAttrSwitch' () {
                  return this.context.categoryAttrSwitch
                },
                'options.attrList' () {
                  return this.context.categoryAttrSwitch ? this.context.sellAttributes : []
                },
                'options.selectAttrMap' () {
                  return this.formData.sellAttributesValueMap
                }
              }
            }
          ],
          async validate ({ value }, $ref) {
            await $ref.validate()
            const { isSp } = computeProduct(this.formData)
            const whiteListMap = {};
            ['weight', 'weightUnit', 'unit', 'name'].forEach((key) => {
              whiteListMap[key] = computeNodeRule(this.context.whiteList, key, isSp)
            })
            validate('skuList', value, undefined, whiteListMap)
          },
          events: {
            'on-change' (skuList, attrList, selectAttrMap) {
              if (skuList !== undefined) {
                this.formData.skuList = skuList
              }
              if (selectAttrMap !== undefined) {
                this.formData.sellAttributesValueMap = selectAttrMap
              }
              if (attrList !== undefined) {
                this.context.sellAttributes = attrList
              }
            }
          }
        }
      ]
    },
    {
      key: 'layout4',
      layout: 'FormCard',
      title: '售卖信息',
      children: [
        {
          key: 'attributeList',
          type: 'ProductAttributes',
          label: '商品属性',
          value: [],
          events: {
            'on-change' (attrs) {
              this.formData.attributeList = attrs
            }
          }
        },
        {
          key: 'shippingTime',
          type: 'SaleTime',
          label: '可售时间',
          value: undefined,
          validate (config, $ref) {
            return $ref.validate()
          },
          events: {
            'on-change' (val) {
              this.formData.shippingTime = val
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.context.modules.sellTime !== false
                }
              }
            }
          ]
        },
        {
          key: 'labelList',
          type: 'ProductLabel',
          label: '商品标签',
          value: [],
          events: {
            'on-change' (val) {
              this.formData.labelList = val
            }
          }
        },
        {
          key: 'minOrderCount',
          type: 'Input',
          label: '最小购买量',
          required: true,
          value: 1,
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          events: {
            'on-change' ($event) {
              this.formData.minOrderCount = $event.target.value
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  return !this.context.categoryAttrSwitch
                }
              }
            }
          ]
        },
        {
          key: 'description',
          type: 'Input',
          label: '商品描述',
          value: '',
          options: {
            type: 'textarea',
            placeholder: '请填写商品的核心卖点，200字以内'
          },
          events: {
            'on-change' ($event) {
              this.formData.description = $event.target.value
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.context.modules.description !== false
                }
              }
            }
          ]
        },
        {
          key: 'pictureContentList',
          type: 'PicDetails',
          label: '图片详情',
          value: [],
          visible: false,
          events: {
            change (v) {
              console.log(v)
              this.formData.pictureContentList = v
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.context.modules.picContent === true
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
