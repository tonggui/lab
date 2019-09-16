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
import { fetchGetCategoryAttrList } from '@/data/repos/category'
import {
  splitCategoryAttrMap
} from './data'
import {
  SELLING_TIME_TYPE
} from '@/data/enums/product'
import createCategoryAttrsConfigs from './components/category-attrs/config'

const computeNodeRule = (rules, key, isSp) => ({
  required: rules.required[key],
  editable: (isSp ? rules.spEditable : rules.editable)[key]
})

const computeProduct = function (key) {
  const isSp = this.getData('isSp')
  const spId = this.getData('spId')
  const rules = this.getContext('whiteList')
  const isConnected = spId > 0
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

const updateProductBySp = (sp, setData) => {
  const newData = {
    ...sp,
    id: this.getData('id'),
    spId: sp.id
  }
  for (let k in newData) {
    setData(k, newData[k])
  }
}

export default () => {
  return [
    {
      type: 'SpChangeInfo',
      layout: null,
      options: {
        changes: [],
        product: {}
      },
      events: {
        confirm (type) {
          if (type !== 1 && type !== 2) {
            return
          }
          const skuList = this.getData('skuList')
          this.getContext('changes').forEach(c => {
            /* eslint-disable vue/script-indent */
            switch (c.field) {
              case 'TITLE':
                this.setData('name', c.newValue)
                break
              case 'PICTURE':
                if (type === 1) {
                  const pictureList = c.newValue
                  this.setData('pictureList', pictureList)
                  this.setData('poorPictureList', [])
                }
                break
              case 'SPEC':
                if (skuList && skuList.length) {
                  const _skutList = skuList.slice()
                  _skutList[0].specName = c.newValue
                  this.setData('skuList', _skutList)
                }
                break
              case 'WEIGHT':
                if (skuList && skuList.length) {
                  const _skutList = skuList.slice()
                  _skutList[0].weight.value = c.newValue
                  _skutList[0].weight.unit = _skutList[0].weight.unit || '克(g)'
                  this.setData('skuList', _skutList)
                }
                break
            }
            /* eslint-enable */
          })
        }
      },
      rules: {
        result: {
          'options.changes' () {
            const categoryAttrList = this.getData('categoryAttrList') || []
            const changes = this.getContext('changes')
            const hasSellAttr = categoryAttrList.some(v => v.attrType === 2)
            // 如果有销售属性，则过滤掉
            if (hasSellAttr) {
              return changes.filter(item => item.field !== 'WEIGHT' && item.field !== 'SPEC')
            }
            return changes
          },
          'options.product' () {
            return {
              skuList: this.getData('skuList')
            }
          }
        }
      }
    },
    {
      layout: 'FormCard',
      options: {
        title: '快捷新建',
        tip: ''
      },
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
              this.setData('upcCode', upc)
            },
            'on-select-product' (sp) {
              if (sp) {
                const {
                  normalAttributes,
                  normalAttributesValueMap,
                  sellAttributes,
                  sellAttributesValueMap
                } = splitCategoryAttrMap(sp.categoryAttrList, sp.categoryAttrValueMap)
                this.setData('normalAttributesValueMap', normalAttributesValueMap)
                this.setData('sellAttributesValueMap', sellAttributesValueMap)
                this.setContext('normalAttributes', normalAttributes)
                this.setContext('sellAttributes', sellAttributes)

                updateProductBySp.call(this, sp)
              }
            }
          },
          rules: {
            result: {
              'options.noUpc' () {
                return this.getContext('modules').suggestNoUpc === true
              }
            }
          }
        }
      ],
      rules: {
        result: {
          'options.title' () {
            return `快捷${this.getContext('modeString')}`
          },
          'options.tip' () {
            return `提高${this.getContext('modeString')}商品效率`
          },
          mounted () {
            return this.getContext('modules').shortCut !== false
          }
        }
      }
    },
    {
      key: 'layout2',
      layout: 'FormCard',
      options: {
        style: {
          paddingBottom: '10px'
        },
        title: '基本信息',
        tip: '填写基本的商品信息，有利于增强商品流量，促进购买转换！'
      },
      children: [
        {
          key: 'name',
          type: 'Input',
          label: '商品标题',
          required: true,
          value: '',
          description: ({
            render () {
              return (
                <span>
                  使用规范的格式填写有利于商品曝光，提高商品的订单量及活动参与量 <a href="http://collegewm.meituan.com/sg/post/detail?id=144&contentType=0" target="_blank">查看标题规范 &gt;</a>
                </span>
              )
            }
          }),
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          events: {
            'on-change' ($event) {
              this.setData('name', $event.target.value)
            }
          },
          options: {
            clearable: true,
            placeholder: '请输入商品标题'
          },
          rules: {
            result: {
              disabled () {
                const { rule } = computeProduct.call(this, 'title')
                return !rule.editable
              },
              required () {
                const { rule } = computeProduct.call(this, 'title')
                return rule.required
              }
            }
          }
        },
        {
          key: 'tagList',
          type: 'TagList',
          label: '店内分类',
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
                return this.getContext('tagList')
              }
            }
          }
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
              this.setData('category', category)
              const categoryAttrSwitch = this.getContext('categoryAttrSwitch')
              const oldSellAttributes = this.getContext('sellAttributes') || []
              const oldNormalAttributesValueMap = this.getData('normalAttributesValueMap')
              const oldSellAttributesValueMap = this.getData('sellAttributesValueMap')
              if (categoryAttrSwitch) {
                if (category.id) {
                  fetchGetCategoryAttrList(category.id).then(attrs => {
                    const {
                      normalAttributes,
                      normalAttributesValueMap,
                      sellAttributes,
                      sellAttributesValueMap
                    } = splitCategoryAttrMap(attrs, { ...oldNormalAttributesValueMap, ...oldSellAttributesValueMap })
                    if (sellAttributes.length > 0 || oldSellAttributes.length > 0) {
                      this.setData('skuList', []) // 清空sku
                    }
                    this.setContext('normalAttributes', normalAttributes)
                    this.setContext('sellAttributes', sellAttributes)
                    this.setData('normalAttributesValueMap', normalAttributesValueMap)
                    this.setData('sellAttributesValueMap', sellAttributesValueMap)
                    this.setData('categoryAttrList', attrs)
                  })
                } else {
                  this.setContext('normalAttributes', [])
                  this.setContext('sellAttributes', [])
                  this.setData('normalAttributesValueMap', {})
                  this.setData('sellAttributesValueMap', {})
                  this.setData('categoryAttrList', [])
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
                this.setContext('normalAttributes', normalAttributes)
                this.setContext('sellAttributes', sellAttributes)
                this.setData('normalAttributesValueMap', normalAttributesValueMap)
                this.setData('sellAttributesValueMap', sellAttributesValueMap)
                updateProductBySp.call(this, product)
              }
            }
          },
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          rules: {
            result: {
              disabled () {
                const { rule } = computeProduct.call(this, 'category')
                return !rule.editable
              },
              required () {
                const { rule } = computeProduct.call(this, 'category')
                return rule.required
              }
            }
          }
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
              this.setData('brand', brand)
            }
          },
          rules: {
            result: {
              mounted () {
                return !this.getContext('categoryAttrSwitch')
              },
              disabled () {
                const { rule } = computeProduct.call(this, 'brand')
                return !rule.editable
              },
              required () {
                const { rule } = computeProduct.call(this, 'brand')
                return rule.required
              }
            }
          }
        },
        {
          key: 'origin',
          type: 'Origin',
          label: '产地',
          options: {
            placeholder: '请输入产地'
          },
          value: {},
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          events: {
            change (origin) {
              this.setData('origin', origin)
            }
          },
          rules: {
            result: {
              mounted () {
                return !this.getContext('categoryAttrSwitch')
              }
            }
          }
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          description: ({
            render () {
              return (
                <span>
                图片支持1:1（600px*600px）/ 4:3（600px*450px），最多上传5张图 <a href="http://collegewm.meituan.com/post/detail/1415" target="_blank">查看详细说明 &gt;</a>
                </span>
              )
            }
          }),
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          value: [],
          options: {
            keywords: '',
            autoCropArea: 1
          },
          events: {
            change (v) {
              this.setData('pictureList', v)
            }
          },
          rules: {
            result: {
              'options.keywords' () {
                return this.getData('name')
              }
            }
          }
        },
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
              mounted () {
                return this.getContext('categoryAttrSwitch')
              },
              // 监听类目属性变化
              attrs () {
                const attrs = this.getContext('normalAttributes')
                const configs = createCategoryAttrsConfigs('normalAttributesValueMap', attrs)
                this.replaceConfigChildren('normalAttributesValueMap', {
                  type: 'div',
                  layout: null,
                  slotName: 'attrs',
                  options: {
                    class: { 'column-mode': attrs.length >= 4 }
                  },
                  children: configs
                })
              }
            }
          }
        }
      ]
    },
    {
      key: 'layout3',
      layout: 'FormCard',
      options: {
        title: '售卖信息',
        tip: '填写售卖信息有助于买家更快的下单，库存为0的在买家端不展示',
        style: {
          paddingBottom: '10px'
        }
      },
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
            hasMinOrderCount: false,
            hasStock: false,
            supportPackingBag: true
          },
          rules: [
            {
              result: {
                'options.hasStock' () {
                  return !!this.getContext('modules').hasStock
                },
                'options.whiteList' () {
                  return this.getContext('whiteList')
                },
                supportPackingBag () {
                  return this.getContext('modules').packingbag
                },
                'options.hasMinOrderCount' () {
                  return this.getContext('categoryAttrSwitch')
                },
                'options.attrList' () {
                  return this.getContext('categoryAttrSwitch') ? this.getContext('sellAttributes') : []
                },
                'options.selectAttrMap' () {
                  return this.getData('sellAttributesValueMap')
                }
              }
            }
          ],
          validate ({ value }) {
            const isSp = this.getData('isSp')
            const whiteListMap = {
              boxPrice: { required: false, editable: true },
              boxNum: { required: false, editable: true }
            };
            ['weight', 'weightUnit', 'unit', 'name'].forEach((key) => {
              whiteListMap[key] = computeNodeRule(this.getContext('whiteList'), key, isSp)
            })
            validate('skuList', value, undefined, whiteListMap)
          },
          events: {
            'on-change' (skuList, attrList, selectAttrMap) {
              if (skuList !== undefined) {
                this.setData('skuList', skuList)
              }
              if (selectAttrMap !== undefined) {
                this.setData('sellAttributesValueMap', selectAttrMap)
              }
              if (attrList !== undefined) {
                this.setContext('sellAttributes', attrList)
              }
            }
          }
        }
      ]
    },
    {
      key: 'layout4',
      layout: 'FormCard',
      options: {
        title: '其他信息',
        style: {
          paddingBottom: '20px'
        }
      },
      children: [
        {
          key: 'attributeList',
          type: 'ProductAttributes',
          label: '商品属性',
          value: [],
          events: {
            'on-change' (attrs) {
              this.setData('attributeList', attrs)
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
        },
        {
          key: 'labelList',
          type: 'ProductLabel',
          label: '商品标签',
          value: [],
          events: {
            'on-change' (val) {
              this.setData('labelList', val)
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
              this.setData('minOrderCount', $event.target.value)
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  return !this.getContext('categoryAttrSwitch')
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
              this.setData('description', $event.target.value)
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.getContext('modules').description !== false
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
          description: '建议图片宽度≥640像素，高度≤960像素；单张图片≤2M，最多上传20张图片；',
          events: {
            change (v) {
              this.setData('pictureContentList', v)
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.getContext('modules').picContent === true
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
