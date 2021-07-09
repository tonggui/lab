import { SPU_FIELD as FIELD } from '../field'
import { isUndefined } from 'lodash'
import { EVENTS_TYPE } from '../form/events'

export default () => ([{
  layout: 'DefaultFormCardLayout',
  mode: 'card',
  options: {
    title: ''
  },
  children: [{
    key: FIELD.UPC_CODE,
    type: 'ChooseProduct', // upc 输入框
    container: 'UpcInput',
    layout: 'FormCardLayout',
    // binding: {
    //   event: 'change'
    // },
    events: {
      delete () {
        this.triggerEvent(EVENTS_TYPE.RESET) // 重置表单信息
      },
      'change-data' (data) {
        this.triggerEvent(EVENTS_TYPE.SET_DATA, data) // 修改表单部分信息，data只是部分信息
      }
    },
    rules: [{
      result: {
        mounted () {
          const field = (this.getContext('field') || {})[FIELD.UPC_CODE] || {}
          if (field.visible) {
            // 编辑场景下不再显示UPC快速输入导航
            if (this.getData('id')) {
              return false
            }
            return true
          }
          return false
        }
      }
    }]
  }]
}, {
  layout: 'DefaultFormCardLayout',
  children: [
    {
      type: 'Navigation',
      layout: 'DefaultFormCardLayout'
    }
  ],
  rules: [{
    result: {
      mounted () {
        return this.getContext('features').navigation
      }
    }
  }]
}, {
  layout: 'FormCardLayout',
  mode: 'card',
  options: {
    title: '基本信息',
    anchor: {
      link: '#basicInfo',
      name: '基本信息' // 基本信息 包涵 upc输入和基本商品信息
    }
  },
  children: [{
    key: FIELD.NAME,
    label: '商品名称',
    type: 'ProductName',
    options: {
      clearable: true,
      width: 440
    },
    binding: {
      event: 'input'
    }
  }, {
    key: FIELD.CATEGORY,
    label: '商品类目',
    type: 'CategoryPath',
    options: {
      placeholder: '请输入类目关键词，例如苹果',
      showProductList: false, // 是否支持 最后一列 标品列表
      supportLocked: false, // 是否支持类目锁定
      width: 440
    },
    binding: {
      event: 'on-change'
    }
  }, {
    key: FIELD.TAG_LIST,
    label: '店内分类',
    type: 'TagList',
    options: {
      placeholder: '请输入或点击选择',
      maxCount: 1,
      separator: ' > ',
      width: 440
    },
    binding: {
      event: 'change'
    },
    rules: [{
      result: {
        // 多分类：5个
        'options.maxCount' () {
          const multiTag = this.getContext('features').allowMultiProductTag
          return multiTag ? 5 : 1
        }
      }
    }]
  }, {
    key: FIELD.IS_MEDICARE,
    label: '医保商品',
    type: 'ProductName',
    options: {
      placeholder: '',
      separator: '',
      width: 40
    },
    binding: {
      event: 'input'
    },
    rules: [{
      result: {
        // mounted () {
        //   const spuId = this.getData('spuId')
        //   return Boolean(spuId) && spuId !== 0
        // }
      }
    }]
  }, {
    key: FIELD.PICTURE_LIST,
    label: '商品图片',
    labelPosition: 'top',
    type: 'ProductPicture',
    options: {
      preview: true,
      autoCropArea: 1,
      poorList: [],
      keywords: '',
      isTimeConsuming: true
    },
    binding: {
      event: 'change'
    },
    rules: {
      result: {
        'options.keywords' () {
          return this.getData('name')
        },
        // TODO：bug，差图需要根据 value的变化，去变化
        'options.poorList' () {
          return this.getData('poorPictureList')
        }
      }
    }
  }, {
    key: FIELD.MARKETING_PICTURE,
    label: '商品营销首图',
    labelPosition: 'top',
    type: 'ProductPicture',
    options: {
      preview: true,
      autoCropArea: 1,
      tags: [],
      showDescription: false
    },
    binding: {
      event: 'change'
    }
  }, {
    key: FIELD.UPC_IMAGE,
    label: '条码图片',
    labelPosition: 'top',
    type: 'UpcImage',
    binding: {
      event: 'on-change'
    }
  }, {
    key: FIELD.PRODUCT_VIDEO,
    label: '封面视频',
    labelPosition: 'top',
    type: 'ProductVideo',
    options: {
      showNote: false
    },
    binding: {
      event: 'change'
    }
  }]
}, {
  layout: 'FormCardLayout',
  mode: 'card',
  options: {
    title: '售卖信息',
    anchor: {
      link: '#sellInfo',
      name: '售卖信息'
    }
  },
  children: [{
    key: FIELD.SKU_LIST,
    type: 'SellInfo',
    container: 'SellInfo',
    layout: null,
    options: {
      attrList: [], // 销售属性
      selectAttrMap: {}, // 销售属性值
      disabledExistSkuColumnMap: {}, // 已存在sku不允许修改的列
      fieldStatus: {}, // sku列的visible，required和disabled
      addable: false, // 是否支持添加sku
      requiredPosition: 'before' // required 的*摆放的位置，支持 before/after
    },
    binding: {
      event: 'on-change'
    },
    rules: [{
      result: {
        'options.attrList' () {
          return this.getData('sellAttributes') || []
        },
        'options.selectAttrMap' () {
          return this.getData('sellAttributesValueMap') || {}
        },
        'options.addable' () {
          return !!this.getContext('features').allowAddSpec // context配置支持添加属性
        },
        'options.disabledExistSkuColumnMap' () {
          return this.getContext('features').disabledExistSkuColumnMap || {}
        },
        'options.fieldStatus' () {
          return this.getContext('skuField') || {}
        }
      }
    }],
    events: {
      'on-change-attr' (attrList, selectAttrMap) {
        if (!isUndefined(attrList)) {
          this.setData('sellAttributes', attrList)
        }
        if (!isUndefined(selectAttrMap)) {
          this.setData('sellAttributesValueMap', selectAttrMap)
        }
      }
    }
  }]
}, {
  layout: 'FormCardLayout',
  mode: 'card',
  options: {
    title: '商品详情',
    anchor: {
      link: '#detailInfo',
      name: '商品详情'
    }
  },
  children: [{
    key: FIELD.CATEGORY_ATTRS,
    type: 'CategoryAttrs',
    options: {
      attrList: [] // 类目属性
    },
    layout: null,
    binding: {
      event: 'change'
    },
    rules: [{
      result: {
        mounted () {
          const attrList = this.getData('normalAttributes') || []
          return attrList.length > 0
        },
        'options.attrList' () {
          return this.getData('normalAttributes') || []
        },
        // 是否支持属性申报
        'options.allowBrandApply' () {
          return !!this.getContext('features').allowBrandApply
        }
      }
    }]
  }, {
    key: FIELD.DESCRIPTION,
    label: '文字详情',
    type: 'Textarea',
    options: {
      type: 'textarea',
      placeholder: '请填写商品的核心卖点，200字以内',
      width: 440,
      maxLength: 200
    },
    binding: {
      event: 'on-change'
    }
  }, {
    key: FIELD.PICTURE_CONTENT,
    label: '图片详情',
    type: 'PicDetails',
    options: {
      needSync: false
    },
    rules: {
      result: {
        'options.needSync' () {
          return !!this.getContext('features').needPicSync
        }
      }
    },
    events: {
      'change-sync' (val) {
        this.setData('picContentSyncPoi', val)
      }
    },
    binding: {
      event: 'change'
    }
  }, {
    key: FIELD.SP_PICTURE_CONTENT,
    label: '品牌商图片详情',
    type: 'SpPicDetails',
    options: {
      description: '',
      tips: '该图片会展示到买家端的商品详情中，便于买家更直观了解商品，有利于提升商品销量。（图片来源于平台商品库，由品牌商提供）',
      pictureList: [],
      style: {
        paddingTop: '10px'
      }
    },
    binding: {
      event: 'change'
    },
    rules: {
      result: {
        mounted () {
          const list = this.getData('spPictureContentList') || []
          return list.length > 0
        },
        'options.description' () {
          const spPictureContentList = this.getData('spPictureContentList')
          return (spPictureContentList && spPictureContentList.length) ? '勾选“展示给买家”，可在用户端的商品详情页中展示品牌商图片详情；' : ''
        },
        'options.pictureList' () {
          return this.getData('spPictureContentList')
        }
      }
    }
  }, {
    type: 'AttrApply', // 属性申报
    mounted: false,
    options: {
      allowApply: true
    },
    rules: {
      result: {
        mounted () {
          return this.getContext('features').allowAttrApply
        }
      }
    }
  }]
}, {
  layout: 'FormCardLayout',
  mode: 'card',
  options: {
    title: '高级设置',
    anchor: {
      link: '#advanced',
      name: '高级设置'
    },
    collapsible: false,
    opened: false
  },
  rules: [{
    result: {
      'options.collapsible' () {
        return !this.getData('id') // 编辑时 展开并不支持 收起
      },
      'options.opened' () {
        return !!this.getData('id') // 编辑时 展开并不支持 收起，新建时默认收起
      }
    }
  }],
  children: [{
    key: FIELD.LABEL_LIST,
    label: '推荐标签',
    type: 'ProductLabel',
    binding: {
      event: 'on-change'
    }
  }, {
    key: FIELD.SALE_TIME,
    label: '售卖时间',
    type: 'SaleTime',
    binding: {
      event: 'on-change'
    }
  },
  // , {
  //   key: FIELD.LIMIT_SALE,
  //   label: '限购规则',
  //   type: 'PurchaseLimitation',
  //   options: {
  //     minCount: 1,
  //     supportMultiPoi: false
  //   },
  //   binding: {
  //     event: 'change'
  //   },
  //   rules: [{
  //     result: {
  //       'options.supportMultiPoi' () {
  //         // 此参数，商家商品中心专属
  //         return !!this.getContext('features').supportLimitSaleMultiPoi
  //       },
  //       'options.minCount' () {
  //         let minCount = 1
  //         const skuList = this.getData('skuList') || []
  //         skuList.forEach(sku => {
  //           minCount = Math.max(minCount, sku.minOrderCount || 0)
  //         })
  //         return minCount
  //       }
  //     }
  //   }]
  // }
  {
    key: FIELD.ATTRIBUTE_LIST,
    label: '商品属性',
    type: 'ProductAttributes',
    binding: {
      event: 'on-change'
    }
  },
  {
    key: FIELD.FREIGHT_TEMPLATE,
    label: '运费模板',
    type: 'FreightTemplate',
    options: {
      shippingTemplateId: '',
      shippingTemplateName: ''
    },
    rules: [{
      result: {
        'options.shippingTemplateId' () {
          return this.getData('shippingTemplateId')
        },
        'options.shippingTemplateName' () {
          return this.getData('shippingTemplateName')
        }
      }
    }],
    events: {
      'on-change' (value) {
        this.setData('shippingTemplateId', value)
      }
    }
  },
  {
    key: FIELD.SELL_STATUS,
    label: '上/下架',
    type: 'SellStatus',
    binding: {
      event: 'change'
    }
  },
  {
    key: FIELD.SALE_TYPE,
    label: '售卖方式',
    type: 'SaleType',
    binding: {
      event: 'change'
    }
  }
  ]
}])
