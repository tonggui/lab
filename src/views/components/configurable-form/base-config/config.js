import { SPU_FELID as FELID } from '../felid'
import { ATTR_TYPE } from '@/data/enums/category'

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
      key: FELID.UPC_CODE,
      type: 'ChooseProduct',
      container: 'UpcInput',
      layout: null,
      binding: {
        event: 'change'
      }
    }]
  }, {
    layout: 'FormCardLayout',
    mode: 'card',
    options: {
      title: '基本信息'
    },
    children: [{
      key: FELID.NAME,
      label: '商品标题',
      type: 'ProductName',
      contentWidth: 440,
      options: {
        clearable: true
      },
      binding: {
        event: 'input'
      }
    }, {
      key: FELID.CATEGORY,
      label: '商品类目',
      type: 'CategoryPath',
      contentWidth: 440,
      options: {
        placeholder: '请输入类目关键词，例如苹果',
        showProductList: false,
        supportLocked: false
      },
      binding: {
        event: 'on-change'
      }
    }, {
      key: FELID.TAG_LIST,
      label: '店内分类',
      type: 'TagList',
      contentWidth: 440,
      options: {
        placeholder: '请输入或点击选择',
        maxCount: 1,
        separator: ' > '
      },
      binding: {
        event: 'change'
      },
      rules: [{
        result: {
          'options.maxCount' () {
            const multiTag = this.getContext('features').multiTag
            return multiTag ? 5 : 1
          }
        }
      }]
    }, {
      key: FELID.PICTURE_LIST,
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
      key: FELID.UPC_IMAGE,
      label: '商品条码',
      labelPosition: 'top',
      type: 'UpcImage',
      binding: {
        event: 'on-change'
      }
    }, {
      key: FELID.PRODUCT_VIDEO,
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
    key: FELID.SKU_LIST,
    type: 'SellInfo',
    container: 'SellInfo',
    options: {
      disabledExistSkuColumnMap: {},
      felidStatus: {},
      addable: false,
      requiredPosition: 'before'
    },
    binding: {
      event: 'on-change'
    },
    rules: [{
      result: {
        'options.addable' () {
          return !!this.getContext('features').multiSku
        },
        'options.disabledExistSkuColumnMap' () {
          return this.getContext('features').disabledExistSkuColumnMap || {}
        },
        'options.felidStatus' () {
          return this.getContext('skuFelid') || {}
        }
      }
    }]
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
    key: FELID.CATEGORY_ATTRS,
    type: 'CategoryAttrs',
    options: {
      attrList: []
    },
    layout: null,
    events: {
      change (value) {
        const categoryAttrValueMap = this.getData('categoryAttrValueMap')
        this.setData('categoryAttrValueMap', { ...categoryAttrValueMap, ...value })
      }
    },
    rules: [{
      result: {
        'options.attrList' () {
          return this.getData('categoryAttrList').filter(attr => ([ATTR_TYPE.SPECIAL, ATTR_TYPE.BASE]).includes(attr.attrType))
        },
        value () {
          const attrList = this.getData('categoryAttrList').filter(attr => ([ATTR_TYPE.SPECIAL, ATTR_TYPE.BASE]).includes(attr.attrType))
          const categoryAttrValueMap = this.getData('categoryAttrValueMap') || {}
          return attrList.reduce((prev, attr) => {
            prev[attr.id] = categoryAttrValueMap[attr.id]
            return prev
          }, {})
        }
      }
    }]
  }, {
    key: FELID.DESCRIPTION,
    label: '文字详情',
    type: 'Input',
    contentWidth: 440,
    options: {
      type: 'textarea',
      placeholder: '请填写商品的核心卖点，200字以内'
    },
    binding: {
      event: 'on-change'
    }
  }, {
    key: FELID.PICTURE_CONTENT,
    label: '图片详情',
    type: 'PicDetails',
    binding: {
      event: 'change'
    }
  }, {
    key: FELID.SP_PICTURE_CONTENT,
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
  children: [{
    key: FELID.LABEL_LIST,
    label: '推荐标签',
    type: 'ProductLabel',
    binding: {
      event: 'on-change'
    }
  }, {
    key: FELID.SALE_TIME,
    label: '售卖时间',
    type: 'SaleTime',
    binding: {
      event: 'on-change'
    }
  }, {
    key: FELID.LIMIT_SALE,
    label: '限购规则',
    type: 'PurchaseLimitation',
    options: {
      minCount: 1,
      supportMultiPoi: false // TODO
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
    key: FELID.ATTRIBUTE_LIST,
    label: '商品属性',
    type: 'ProductAttributes',
    binding: {
      event: 'on-change'
    }
  },
  {
    key: FELID.SELL_STATUS,
    label: '上下架状态',
    type: 'SellStatus',
    binding: {
      event: 'change'
    }
  }
  ]
}])
