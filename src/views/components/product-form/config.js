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
import validate, { weightOverflow } from './validate'
import { fetchGetCategoryAttrList, fetchGetSuggestTagInfo, fetchGetSuggestCategoryByProductName } from '@/data/repos/category'
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
import { fetchGetNeedAudit } from '@/data/repos/product'
import {
  splitCategoryAttrMap
} from './data'
import {
  SELLING_TIME_TYPE,
  PRODUCT_AUDIT_STATUS
} from '@/data/enums/product'
import { ATTR_TYPE } from '@/data/enums/category'
import createCategoryAttrsConfigs from './components/category-attrs/config'
import { VIDEO_STATUS } from '@/data/constants/video'
import computeAuditFieldTips from './components/audit-field-tip/audit-field-rule'
import lx from '@/common/lx/lxReport'
import moduleControl from '@/module'
import { EDIT_TYPE } from '@/data/enums/common'
import { AuditFieldTipType } from '@/views/components/product-form/components/audit-field-tip/constants'

// 是否因为字段可编辑导致字段锁定
const isFieldLockedWithPropertyLock = function (key) {
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
    Object.entries(newData).forEach(([key, value]) => this.setData(key, value))
    if (newData.category && newData.category.id) {
      // 获取商品是否满足需要送审条件
      fetchGetNeedAudit(newData.category.id).then(({ poiNeedAudit, categoryNeedAudit }) => {
        this.setContext('poiNeedAudit', poiNeedAudit)
        this.setContext('categoryNeedAudit', categoryNeedAudit)
      })
    }
    if (newData.upcCode) {
      this.setContext('upcExisted', true)
    }
  }
}

// 运营仅可以修改商品名称、后台类目以及所有非销售属性的类目属性
const managerCanEditField = ['name', 'category', 'normalAttributesValueMap']

// 是否因为审核导致字段锁定
export const isFieldLockedWithAudit = function (key) {
  const modules = this.getContext('modules')
  const isManager = modules.isManager
  const managerEdit = modules.managerEdit
  const editType = modules.editType
  if (isManager) {
    return !managerEdit || !managerCanEditField.includes(key)
  }
  // 编辑类型不为审核中编辑时
  return editType !== EDIT_TYPE.AUDITING_MODIFY_AUDIT && this.getData('auditStatus') === PRODUCT_AUDIT_STATUS.AUDITING
}

const updateCategoryAttrByCategoryId = function (categoryId) {
  const oldSellAttributes = this.getContext('sellAttributes') || []
  const oldNormalAttributesValueMap = this.getData('normalAttributesValueMap')
  const oldSellAttributesValueMap = this.getData('sellAttributesValueMap')
  if (categoryId) {
    fetchGetCategoryAttrList(categoryId).then(attrs => {
      const {
        normalAttributes,
        normalAttributesValueMap,
        sellAttributes,
        sellAttributesValueMap
      } = splitCategoryAttrMap(attrs, { ...oldNormalAttributesValueMap, ...oldSellAttributesValueMap })
      this.setContext('normalAttributes', normalAttributes)
      this.setContext('sellAttributes', sellAttributes)
      this.setData('normalAttributesValueMap', normalAttributesValueMap)
      this.setData('sellAttributesValueMap', sellAttributesValueMap)
      this.setData('categoryAttrList', attrs)
      if (sellAttributes.length > 0 || oldSellAttributes.length > 0) {
        Promise.resolve().then(() => {
          this.setData('skuList', []) // 清空sku
        })
      }
    })
    // 获取商品是否满足需要送审条件
    fetchGetNeedAudit(categoryId).then(({ poiNeedAudit, categoryNeedAudit }) => {
      this.setContext('poiNeedAudit', poiNeedAudit)
      this.setContext('categoryNeedAudit', categoryNeedAudit)
    })
  } else {
    this.setContext('normalAttributes', [])
    this.setContext('sellAttributes', [])
    this.setData('normalAttributesValueMap', {})
    this.setData('sellAttributesValueMap', {})
    this.setData('categoryAttrList', [])
  }
}

export default () => {
  const formConfig = [
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
                  const _skuList = skuList.slice()
                  _skuList[0].specName = c.newValue
                  this.setData('skuList', _skuList)
                }
                break
              case 'WEIGHT':
                if (skuList && skuList.length) {
                  const _skuList = skuList.slice()
                  _skuList[0].weight.value = c.newValue
                  _skuList[0].weight.unit = _skuList[0].weight.unit || '克(g)'
                  this.setData('skuList', _skuList)
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
              id: this.getData('id'),
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
          type: 'ChooseProduct',
          value: '',
          options: {
            showTopSale: false,
            style: 'padding: 0 0 20px;',
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
              // 清空upc也需要重置upcExisted
              if (!upc) {
                this.setContext('upcExisted', false)
              }
            },
            'on-select-product' (sp) {
              updateProductBySp.call(this, sp)
            },
            'on-update-category' (category) {
              if (category.id && category.idPath) {
                this.setData('category', category)
                updateCategoryAttrByCategoryId.call(this, category.id)
              }
            },
            upcSugFailed () {
              // 更新upcExisted
              this.setContext('upcExisted', false)
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
              disabled () {
                return isFieldLockedWithAudit.call(this, 'upcCode')
              },
              'options.noUpc' () {
                return !!this.getContext('suggestNoUpc')
              },
              'options.auditTips' () {
                // 本字段有编辑修改提示
                return computeAuditFieldTips(
                  this,
                  'upcCode',
                  ({ type }) => type !== AuditFieldTipType.AUDITOR_CHANGE
                )
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
            return !!this.getContext('shortCut')
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
        tip: ({
          render () {
            return (
              <span>
                填写基本的商品信息，有利于增强商品流量，促进购买转换！ <a href="https://shangou.meituan.com/college#/detail?resourceId=335&type=0&hideHeader=1" target="_blank">查看商品审核教程 &gt;</a>
              </span>
            )
          }
        })
      },
      children: [
        {
          key: 'name',
          type: 'ProductName',
          label: '商品标题',
          required: true,
          value: '',
          startEventName: 'on-focus',
          endEventName: 'on-blur',
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
            input (value) {
              this.setData('name', value)
            },
            change (name) {
              const allowSuggestCategory = !!this.getContext('modules').allowSuggestCategory
              // 支持推荐类目&不是标品&当前标题不为空时获取推荐类目，否则置空推荐类目
              if (allowSuggestCategory && name) {
                this.setContext('suggestingCategory', true)
                fetchGetSuggestCategoryByProductName(name).then(category => {
                  this.setContext('suggestingCategory', false)
                  if (!category || !category.id) {
                    return
                  }
                  const suggestCategory = this.getContext('suggestCategory') || {}
                  // 修改 - 编辑场景不需要回填逻辑
                  const curCategory = this.getData('category')
                  const id = this.getData('id')
                  console.log('id', id)
                  // 如果当前没有类目，自动填上
                  if (!id && (!curCategory || !curCategory.id)) {
                    this.setData('category', {
                      id: category.id,
                      idPath: category.idPath,
                      name: category.name,
                      namePath: category.namePath,
                      isLeaf: category.isLeaf,
                      level: category.level
                    })
                    updateCategoryAttrByCategoryId.call(this, category.id)
                  }
                  if (category.id !== suggestCategory.id) {
                    if (category.id && suggestCategory.id) { // 初始时，suggestCategory还没获取到时不用考虑，只考虑后续的变更
                      this.setContext('ignoreSuggestCategoryId', null)
                    }
                    this.setContext('suggestCategory', category || {})
                  }
                }).catch(err => {
                  this.setContext('suggestingCategory', false)
                  console.error(err)
                  this.setContext('suggestCategory', {})
                })
              } else {
                this.setContext('suggestCategory', {})
              }
            }
          },
          options: {
            clearable: true,
            placeholder: '请输入品牌+商品名称+售卖规格，如农夫山泉 天然水 500ml/1瓶'
          },
          rules: {
            result: {
              layout () {
                return isFieldLockedWithPropertyLock.call(this, 'name') ? 'WithDisabled' : undefined
              },
              disabled () {
                return isFieldLockedWithPropertyLock.call(this, 'name') || isFieldLockedWithAudit.call(this, 'name')
              },
              'options.auditTips' () {
                // 本字段有编辑修改提示
                return computeAuditFieldTips(
                  this,
                  'name',
                  ({ type }) => type === AuditFieldTipType.AUDITOR_CHANGE
                )
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
          display (v) {
            return (v.namePath || []).join(' > ')
          },
          options: {
            suggesting: false,
            placeholder: '请输入类目关键词，例如苹果',
            suggest: {}
          },
          events: {
            'on-change' (category) {
              this.setData('category', category)
              if (category.id) { // 清空不用重置暂不使用标识
                this.setContext('ignoreSuggestCategoryId', null)
              }
              updateCategoryAttrByCategoryId.call(this, category.id)
            },
            'on-select-product' (product) {
              updateProductBySp.call(this, product)
            },
            ignoreSuggest (id) {
              this.setContext('ignoreSuggestCategoryId', id)
            },
            showSpListModal () {
              this.setContext('showSpListModal', true)
            },
            // 类目推荐首次出现
            suggestDebut (suggestCategoryId) {
              const name = this.getData('name')
              // 类目推荐mv，只记录初次
              lx.mv({
                bid: 'b_shangou_online_e_b7qvo2f9_mv',
                val: { product_spu_name: name, tag_id: suggestCategoryId }
              })
            },
            denyConfirmDebut (suggestCategoryId) {
              const name = this.getData('name')
              // 推荐类目暂不使用mv，只记录初次
              lx.mv({
                bid: 'b_shangou_online_e_9hbu8q94_mv',
                val: { product_spu_name: name, tag_id: suggestCategoryId }
              })
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
              layout () {
                return isFieldLockedWithPropertyLock.call(this, 'category') ? 'WithDisabled' : undefined
              },
              disabled () {
                return isFieldLockedWithPropertyLock.call(this, 'category') || isFieldLockedWithAudit.call(this, 'category')
              },
              'options.auditTips' () {
                return computeAuditFieldTips(this, 'category')
              },
              'options.suggesting' () {
                return this.getContext('suggestingCategory')
              },
              // 修改类目推荐
              'options.suggest' () {
                const spId = this.getData('spId')
                const ignoreSuggestCategoryId = this.getContext('ignoreSuggestCategoryId')
                const suggestCategory = this.getContext('suggestCategory') || {}
                return (spId || (ignoreSuggestCategoryId === suggestCategory.id)) ? {} : suggestCategory
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
              disabled () {
                return isFieldLockedWithAudit.call(this, 'tagList')
              },
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
            preview: true,
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
              disabled () {
                return isFieldLockedWithAudit.call(this, 'pictureList')
              },
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
          key: 'upcImage',
          type: 'UpcImage',
          label: '商品条码图',
          required: true,
          mounted: false,
          value: '',
          description: '条码暂未收录，请上传商品条码图。此图用于商品审核，不会在买家端展示',
          events: {
            'on-change' (value) {
              this.setData('upcImage', value)
            }
          },
          rules: {
            result: {
              disabled () {
                return isFieldLockedWithAudit.call(this, 'upcImage')
              },
              mounted () {
                const skuList = this.getData('skuList')
                const upcCode = Array.isArray(skuList) && skuList.length && skuList[0].upcCode

                if (!upcCode) return false
                const disabled = isFieldLockedWithAudit.call(this, 'upcImage')
                const upcImageModule = this.getContext('modules').upcImage
                // 审核模式下，锁定状态时，根据是否有值控制是否显示
                if (upcImageModule && disabled) {
                  return !!this.getData('upcImage')
                }
                // 规格第一个upcCode存在情况下
                const needAudit = this.getContext('needAudit')
                return needAudit
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
              },
              disabled () {
                return isFieldLockedWithAudit.call(this, 'video')
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
                const allowBrandApply = !!this.getContext('modules').allowBrandApply
                const configs = createCategoryAttrsConfigs('normalAttributesValueMap', attrs, { allowBrandApply })
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
                return this.getContext('modules').allowAttrApply
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
            disabledExistSkuColumnMap: {},
            fieldStatus: {
              specName: {
                required: false,
                visible: true
              },
              price: {
                required: true,
                visible: true
              },
              stock: {
                required: true,
                visible: true
              },
              weight: {
                required: true,
                visible: true
              },
              minOrderCount: {
                required: true,
                visible: true
              },
              box: {
                required: false,
                visible: false
              },
              sourceFoodCode: {
                required: false,
                visible: true
              },
              upcCode: {
                required: true,
                visible: true
              },
              shelfNum: {
                required: false,
                visible: true
              }
            }
          },
          rules: [
            {
              result: {
                disabled () {
                  return isFieldLockedWithAudit.call(this, 'skuList')
                },
                'options.fieldStatus' () {
                  const requiredMap = this.getContext('modules').requiredMap || {}
                  return {
                    spec: {
                      required: false,
                      visible: true
                    },
                    price: {
                      required: true,
                      visible: true
                    },
                    stock: {
                      required: true,
                      visible: true
                    },
                    weight: {
                      required: requiredMap.weight,
                      visible: true
                    },
                    minOrderCount: {
                      required: true,
                      visible: true
                    },
                    box: {
                      required: false,
                      visible: !!this.getContext('modules').packingBag
                    },
                    sourceFoodCode: {
                      required: false,
                      visible: true
                    },
                    upcCode: {
                      required: requiredMap.upc,
                      visible: true
                    },
                    shelfNum: {
                      required: false,
                      visible: true
                    }
                  }
                },
                'options.disabledExistSkuColumnMap' () {
                  return this.getContext('modules').disabledExistSkuColumnMap || {}
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
            for (let i = 0; i < value.length; i++) {
              const sku = value[i]
              if (!sku.weight.ignoreMax && weightOverflow(sku.weight)) return '重量过大，请核实后再保存商品'
            }
            return validate('skuList', value, {
              ignore: {
                ladderPrice: !supportPackingBag,
                ladderNum: !supportPackingBag
              }
            })
          },
          events: {
            'on-change-attr' (attrList, selectAttrMap) {
              if (attrList !== undefined) {
                this.setContext('sellAttributes', attrList)
              }
              if (selectAttrMap !== undefined) {
                this.setData('sellAttributesValueMap', selectAttrMap)
              }
            },
            'on-change' (skuList) {
              if (skuList !== undefined) {
                this.setData('skuList', skuList)
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
                }).catch(e => console.error(`查询UPC是否存在失败: ${e}`))
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
          validate ({ value }) {
            const { status = 0, range = [], rule, max = 0 } = value
            if (!status) return '' // 不限制的话不进行校验
            if (!range.length || range.some(v => !v)) return '限购周期不能为空'
            if (!rule) return '请选择限购规则'
            // 最大购买量不能小于sku中最小购买量的最大值
            const skuList = this.getData('skuList') || []
            let minCount = 1
            skuList.forEach(sku => {
              minCount = Math.max(minCount, sku.minOrderCount || 0)
            })
            if (max < minCount) return '限购数量必须>=最小购买量'
          },
          rules: {
            result: {
              mounted () {
                return !!this.getContext('modules').limitSale
              },
              'options.supportMultiPoi' () {
                return !!this.getContext('modules').supportLimitSaleMultiPoi
              },
              disabled () {
                return isFieldLockedWithAudit.call(this, 'limitSale')
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
          },
          rules: {
            result: {
              disabled () {
                return isFieldLockedWithAudit.call(this, 'attributeList')
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
              disabled () {
                return isFieldLockedWithAudit.call(this, 'shippingTime')
              },
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
          },
          rules: {
            result: {
              disabled () {
                return isFieldLockedWithAudit.call(this, 'labelList')
              }
            }
          }
        },
        {
          key: 'description',
          type: 'Input',
          label: '商品描述',
          value: '',
          startEventName: 'on-focus',
          endEventName: 'on-blur',
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
                disabled () {
                  return isFieldLockedWithAudit.call(this, 'description')
                },
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
                disabled () {
                  return isFieldLockedWithAudit.call(this, 'pictureContentList')
                },
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
                disabled () {
                  return isFieldLockedWithAudit.call(this, 'spPictureContentSwitch')
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
  return formConfig
}
