import { SPU_FIELD as FIELD } from '../field'
import { isUndefined } from 'lodash'
import { EVENTS_TYPE } from '../form/events'

export default () => ([{
  layout: 'DefaultFormCardLayout',
  options: {
    anchor: {
      link: '#basicInfo',
      name: '基本信息'
    }
  },
  children: [{
    layout: 'FormCardLayout',
    mode: 'card',
    options: {
      title: ''
    },
    children: [{
      key: FIELD.UPC_CODE,
      type: 'ChooseProduct',
      container: 'UpcInput',
      layout: null,
      binding: {
        event: 'change'
      },
      events: {
        delete () {
          this.triggerEvent(EVENTS_TYPE.RESET)
        },
        'change-data' (data) {
          this.triggerEvent(EVENTS_TYPE.SET_DATA, data)
        }
      }
    }]
  }, {
    layout: 'FormCardLayout',
    mode: 'card',
    options: {
      title: '基本信息'
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
        showProductList: false,
        supportLocked: false,
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
          'options.maxCount' () {
            const multiTag = this.getContext('features').allowMultiProductTag
            return multiTag ? 5 : 1
          }
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
        keywords: ''
      },
      binding: {
        event: 'change'
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
      attrList: [],
      selectAttrMap: {},
      disabledExistSkuColumnMap: {},
      fieldStatus: {},
      addable: false,
      requiredPosition: 'before'
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
          return !!this.getContext('features').allowAddSpec
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
      attrList: []
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
        'options.allowBrandApply' () {
          return !!this.getContext('features').allowBrandApply
        }
      }
    }]
  }, {
    key: FIELD.DESCRIPTION,
    label: '文字详情',
    type: 'Text',
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
          const pictureContentList = this.getData('pictureContentList')
          return (pictureContentList && pictureContentList.length) ? '勾选“展示给买家”，可在用户端的商品详情页中展示品牌商图片详情；' : ''
        },
        'options.pictureList' () {
          return this.getData('spPictureContentList')
        }
      }
    }
  }, {
    type: 'AttrApply',
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
    collapsible: true,
    opened: true
  },
  rules: [{
    result: {
      'options.opened' () {
        return !this.getData('id')
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
  }, {
    key: FIELD.LIMIT_SALE,
    label: '限购规则',
    type: 'PurchaseLimitation',
    options: {
      minCount: 1,
      supportMultiPoi: false
    },
    binding: {
      event: 'change'
    },
    rules: [{
      result: {
        'options.supportMultiPoi' () {
          return !!this.getContext('features').supportLimitSaleMultiPoi
        },
        'options.minCount' () {
          let minCount = 1
          const skuList = this.getData('skuList') || []
          skuList.forEach(sku => {
            minCount = Math.max(minCount, sku.minOrderCount || 0)
          })
          return minCount
        }
      }
    }]
  }, {
    key: FIELD.ATTRIBUTE_LIST,
    label: '商品属性',
    type: 'ProductAttributes',
    binding: {
      event: 'on-change'
    }
  },
  {
    key: FIELD.SELL_STATUS,
    label: '上架状态',
    type: 'SellStatus',
    binding: {
      event: 'change'
    }
  }
  ]
}])
