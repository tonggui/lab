/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
import { isEmpty } from '@/common/utils'
import moment from 'moment'
import validate from './validate'
import { fetchGetCategoryAttrList, fetchGetSuggestTagInfo } from '@/data/repos/category'
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
import {
  splitCategoryAttrMap
} from './data'
import {
  SELLING_TIME_TYPE
} from '@/data/enums/product'
import { ATTR_TYPE } from '@/data/enums/category'
import createCategoryAttrsConfigs from './components/category-attrs/config'
import { VIDEO_STATUS } from '@/data/constants/video'
import lx from '@/common/lx/lxReport'
import moduleControl from '@/module'

const isFieldLocked = function (key) {
  const isSp = this.getData('isSp')
  const spId = this.getData('spId')
  const propertyLock = this.getContext('modules').propertyLock
  const isConnected = spId > 0
  const lockKeys = isSp ? ['name', 'category'] : ['category']
  return propertyLock && isConnected && lockKeys.includes(key)
}

const updateProductBySp = function (sp) {
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
    const newData = {
      ...sp,
      id: this.getData('id'),
      spId: sp.id
    }
    // 如果是标品选中条码商品，否则选中无条码商品
    this.setContext('suggestNoUpc', !newData.isSp)
    for (let k in newData) {
      this.setData(k, newData[k])
    }
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
          const id = this.getData('id')
          lx.mc({ bid: 'b_shangou_online_e_igr1pn6t_mc', val: { op_type: type, spu_id: id || 0 } })
          this.setContext('spChangeInfoDecision', type)
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
            const changes = this.getContext('changes')
            const categoryAttrList = this.getData('categoryAttrList') || []
            const hasSellAttr = categoryAttrList.some(v => v.attrType === ATTR_TYPE.SELL)
            // 如果有销售属性，则过滤掉规格
            if (hasSellAttr) {
              return changes.filter(item => item.field !== 'SPEC')
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
      type: 'SpListModal',
      layout: null,
      value: false,
      options: {
        showTopSale: false
      },
      events: {
        'on-select-product' (sp) {
          updateProductBySp.call(this, sp)
          this.setContext('showSpListModal', false)
        },
        input (v) {
          this.setContext('showSpListModal', v)
        }
      },
      rules: {
        result: {
          'options.showTopSale' () {
            return this.getContext('modules').showCellularTopSale === true
          },
          value () {
            return !!this.getContext('showSpListModal')
          }
        }
      }
    },
    {
      layout: 'FormCard',
      options: {
        title: '',
        tip: ''
      },
      children: [
        {
          key: 'upcCode',
          layout: null,
          type: 'ChooseProduct',
          value: '',
          options: {
            showTopSale: false,
            style: 'padding: 0 20px 20px;',
            placeholder: undefined
          },
          events: {
            'on-change' (upc) {
              this.setData('upcCode', upc)
              // 一旦信息发生变更，需要将关联信息置空
              this.setData('spId', 0)
              this.setData('isSp', false)
              this.setData('releaseType', 0)
              this.setData('suggestedPrice', 0)
              this.setData('maxPrice', 0)
              this.setData('minPrice', 0)
            },
            'on-select-product' (sp) {
              updateProductBySp.call(this, sp)
            },
            tabChange (tab) {
              this.setContext('suggestNoUpc', tab === 'noUpc')
            },
            showSpListModal () {
              this.setContext('showSpListModal', true)
            }
          },
          rules: {
            result: {
              'options.noUpc' () {
                return !!this.getContext('suggestNoUpc')
              }
            }
          }
        }
      ],
      rules: {
        result: {
          'options.title' () {
            const typeStr = this.getContext('isCreate') ? '新建' : '修改'
            return `快捷${typeStr}`
          },
          'options.tip' () {
            const typeStr = this.getContext('isCreate') ? '新建' : '修改'
            return `提高${typeStr}商品效率`
          },
          mounted () {
            return this.getContext('modules').shortCut !== false
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
        title: '基本信息',
        tip: '填写基本的商品信息，有利于增强商品流量，促进购买转换！'
      },
      children: [
        {
          key: 'name',
          type: 'Input',
          layout: 'WithDisabled',
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
                return isFieldLocked.call(this, 'name')
              }
            }
          }
        },
        {
          key: 'category',
          type: 'CategoryPath',
          layout: 'WithDisabled',
          label: '商品类目',
          value: {},
          required: true,
          description: '商品类目是大众统一认知的分类，是为买家推荐和搜索的重要依据之一，请认真准确填写，否则将影响曝光和订单转化',
          hoverMode: true,
          options: {
            placeholder: '请输入或点击选择'
          },
          events: {
            'on-change' (category) {
              this.setData('category', category)
              const oldSellAttributes = this.getContext('sellAttributes') || []
              const oldNormalAttributesValueMap = this.getData('normalAttributesValueMap')
              const oldSellAttributesValueMap = this.getData('sellAttributesValueMap')
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
            },
            'on-select-product' (product) {
              updateProductBySp.call(this, product)
            },
            showSpListModal () {
              this.setContext('showSpListModal', true)
            }
          },
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          rules: {
            result: {
              // 监听类目信息变化
              categoryId () {
                const category = this.getData('category')
                moduleControl.setContext('product', { categoryId: category.id })
              },
              disabled () {
                return isFieldLocked.call(this, 'category')
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
            suggestList: [],
            categoryTemplateApplying: false,
            source: [],
            maxCount: 5,
            separator: ' > ',
            placeholder: '请输入或点击选择'
          },
          validate ({ type, label, value = [], required }) {
            if (required && type === 'TagList' && isEmpty(value)) {
              throw new Error(`${label}不能为空`)
            }
            if (required && type === 'TagInput' && (isEmpty(value) || !value[0].name)) {
              throw new Error(`${label}不能为空`)
            }
          },
          events: {
            change (val = []) {
              this.setData('tagList', val)
            },
            showCategoryTemplate () {
              this.triggerEvent('showCategoryTemplate')
            }
          },
          rules: {
            result: {
              required () {
                // 应用了分类模板之后店内分类不再必填
                return !this.getContext('usedBusinessTemplate')
              },
              type () {
                const isBatch = this.getContext('modules').isBatch
                const usedBusinessTemplate = this.getContext('usedBusinessTemplate')
                const haveCategoryTemplate = this.getContext('modules').haveCategoryTemplate
                return isBatch ? 'TagInput' : ((usedBusinessTemplate || haveCategoryTemplate) ? 'TagListWithSuggest' : 'TagList')
              },
              'options.suggestList' () {
                const usedBusinessTemplate = this.getContext('usedBusinessTemplate')
                if (usedBusinessTemplate) {
                  const tagList = this.getContext('tagList')
                  const categoryId = (this.getData('category') || {}).id
                  return (categoryId && tagList && tagList.length) ? fetchGetSuggestTagInfo(categoryId) : []
                } else {
                  return []
                }
              },
              'options.source' () {
                return this.getContext('tagList') || []
              },
              'options.maxCount' () {
                return this.getContext('modules').maxTagCount || 1
              },
              'options.categoryTemplateApplying' () {
                return !!this.getContext('categoryTemplateApplying')
              },
              'options.needApplyWarning' () {
                const tagCount = (this.getContext('tagList') || []).length // 一级分类数量
                const haveCategoryTemplate = this.getContext('modules').haveCategoryTemplate
                const usedBusinessTemplate = this.getContext('usedBusinessTemplate')
                const tagLimit = this.getContext('modules').tagLimit
                const poor = tagCount <= 5
                const rich = tagLimit && tagCount >= tagLimit
                return (haveCategoryTemplate && !usedBusinessTemplate && (poor || rich)) ? `检测到店内分类${poor ? '过少' : '过多'}，建议使用分类模板，可提高商品曝光及转化` : ''
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
            autoCropArea: 1,
            poorList: []
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
              },
              'options.poorList' () {
                return this.getData('poorPictureList')
              }
            }
          }
        },
        {
          key: 'video',
          type: 'ProductVideo',
          label: '商品视频',
          description: '温馨提示：商品视频有利于曝光及下单转化',
          required: false,
          value: null,
          validate ({ value }) {
            if (value && value.id && value.status !== VIDEO_STATUS.SUCCESS) {
              return '商品视频状态异常'
            }
          },
          events: {
            change (v) {
              this.setData('video', v)
            }
          },
          rules: {
            result: {
              mounted () {
                return !!this.getContext('modules').productVideo
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
              // 监听类目属性变化
              attrs () {
                const attrs = this.getContext('normalAttributes')
                const allowApply = !!this.getContext('modules').allowApply
                const configs = createCategoryAttrsConfigs('normalAttributesValueMap', attrs, { allowApply })
                this.replaceConfigChildren('normalAttributesValueMap', {
                  type: 'div',
                  layout: null,
                  options: {
                    class: attrs.length >= 4 ? 'row-mode' : 'column-mode'
                  },
                  slotName: 'attrs',
                  children: configs
                })
              },
              'options.allowApply' () {
                return this.getContext('modules').allowApply
              }
            }
          }
        }
      ]
    },
    {
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
            requiredMap: {},
            hasMinOrderCount: true,
            disabledExistSkuColumnMap: {},
            supportPackingBag: true
          },
          rules: [
            {
              result: {
                'options.disabledExistSkuColumnMap' () {
                  return this.getContext('modules').disabledExistSkuColumnMap || {}
                },
                'options.requiredMap' () {
                  const requiredMap = this.getContext('modules').requiredMap || {}
                  return {
                    spec: false,
                    price: true,
                    stock: true,
                    weight: requiredMap.weight,
                    minOrderCount: true,
                    box: false,
                    sourceFoodCode: false,
                    upc: requiredMap.upc,
                    shelfNum: false
                  }
                },
                'options.supportPackingBag' () {
                  return this.getContext('modules').packingBag
                },
                'options.attrList' () {
                  return this.getContext('sellAttributes')
                },
                'options.selectAttrMap' () {
                  return this.getData('sellAttributesValueMap')
                }
              }
            }
          ],
          validate ({ value, options }) {
            const { supportPackingBag } = options
            validate('skuList', value, {
              ignore: {
                boxPrice: !supportPackingBag,
                boxNum: !supportPackingBag
              }
            })
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
            },
            'upc-sug' (sku, index) {
              const upcCode = sku.upcCode
              if (upcCode) {
                // 获取标品的重量信息来修改当前sku的重量信息
                fetchGetSpInfoByUpc(upcCode).then(product => {
                  if (product && product.skuList && product.skuList[0]) {
                    const weight = product.skuList[0].weight
                    // 只要值不一样，则重新赋值
                    if (weight.value !== sku.weight.value || weight.unit !== sku.weight.unit) {
                      this.setData(`skuList.${index}.weight`, weight)
                    }
                  }
                })
              }
            }
          }
        },
        {
          key: 'limitSale',
          type: 'PurchaseLimitation',
          label: ({
            render () {
              return (
                <span style="white-space: nowrap">
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
          options: {
            style: {
              marginLeft: '10px'
            }
          },
          events: {
            'change' (v) {
              this.setData('limitSale', v)
            }
          },
          rules: {
            result: {
              mounted () {
                return !!this.getContext('modules').limitSale
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
          validate ({ value = [] }) {
            if (value.length > 20) {
              return '图片详情最多只能上传20张图片'
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
        },
        {
          key: 'spPictureContentSwitch',
          type: 'SpPicDetails',
          label: '品牌商图<br>片详情',
          value: true,
          mounted: false,
          options: {
            description: '',
            tips: '该图片会展示到买家端的商品详情中，便于买家更直观了解商品，有利于提升商品销量。（图片来源于平台商品库，由品牌商提供）',
            pictureList: [],
            style: {
              paddingTop: '10px'
            }
          },
          events: {
            change (v) {
              this.setData('spPictureContentSwitch', v)
            }
          },
          rules: [
            {
              result: {
                mounted () {
                  const spPictureContentList = this.getData('spPictureContentList')
                  return !!(this.getContext('modules').spPicContent && spPictureContentList && spPictureContentList.length)
                },
                'options.description' () {
                  const pictureContentList = this.getData('pictureContentList')
                  return (pictureContentList && pictureContentList.length) ? '勾选“展示给买家”，可在用户端的商品详情页中展示品牌商图片详情；' : ''
                },
                'options.pictureList' () {
                  return this.getData('spPictureContentList')
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
