import { SPU_FELID as FELID } from '../felid'
import { ATTR_TYPE } from '@/data/enums/category'
import { isUndefined } from 'lodash'

export default (components) => ([{
  title: '基本信息',
  children: [{
    key: FELID.NAME,
    label: '商品标题',
    type: components.ProductName,
    options: {
      clearable: true,
      placeholder: '请输入品牌+商品名称+售卖规格，如农夫山泉 天然水 500ml/1瓶'
    },
    binding: {
      event: 'input'
    }
  }, {
    key: FELID.CATEGORY,
    label: '商品类目',
    type: components.CategoryPath,
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
    type: components.TagList,
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
    type: components.ProductPicture,
    options: {
      preview: true,
      // 商超药品有差异
      autoCropArea: 1, // TODO
      poorList: [], // TODO
      keywords: '' // TODO
    },
    binding: {
      event: 'change'
    }
  }, {
    key: FELID.UPC_IMAGE,
    label: '商品条码',
    labelPosition: 'top',
    type: components.UpcImage,
    binding: {
      event: 'on-change'
    }
  }, {
    key: FELID.PRODUCT_VIDEO,
    label: '封面视频',
    labelPosition: 'top',
    type: components.ProductVideo,
    options: {
      showNote: false
    },
    binding: {
      event: 'change'
    }
  }]
}, {
  title: '售卖信息',
  children: [{
    key: FELID.SKU_LIST,
    type: components.SellInfo,
    options: {
      disabledExistSkuColumnMap: {},
      felidStatus: {},
      attrList: [],
      selectAttrMap: {},
      addable: false,
      requiredPosition: 'before'
    },
    events: {
      // TODO
      'on-change' (skuList, attrList, selectAttrMap) {
        if (!isUndefined(skuList)) {
          this.setData('skuList', skuList)
        }
        if (!isUndefined(attrList)) {
          let categoryAttrList = [...this.getData('categoryAttrList')]
          categoryAttrList = categoryAttrList.map(attr => {
            const newAttr = attrList.find(a => a.id === attr.id)
            return newAttr || attr
          })
          this.setData('categoryAttrList', categoryAttrList)
        }
        if (!isUndefined(selectAttrMap)) {
          const categoryAttrValueMap = this.getData('categoryAttrValueMap')
          this.setData('categoryAttrValueMap', { ...categoryAttrValueMap, ...selectAttrMap })
        }
      }
    },
    rules: {
      result: {
        'options.addable' () {
          return !!this.getContext('features').multiSku
        },
        'options.disabledExistSkuColumnMap' () {
          return this.getContext('features').disabledExistSkuColumnMap || {}
        },
        'options.felidStatus' () {
          return this.getContext('skuFelid') || {}
        },
        'options.attrList' () {
          return this.getData('categoryAttrList').filter(attr => attr.attrType === ATTR_TYPE.SELL)
        },
        'options.selectAttrMap' () {
          const attrList = this.getData('categoryAttrList').filter(attr => attr.attrType === ATTR_TYPE.SELL)
          const categoryAttrValueMap = this.getData('categoryAttrValueMap') || {}
          return attrList.reduce((prev, attr) => {
            prev[attr.id] = categoryAttrValueMap[attr.id]
            return prev
          }, {})
        }
      }
    }
  }]
}, {
  title: '商品详情',
  children: [{
    key: FELID.CATEGORY_ATTRS,
    type: 'div',
    layout: null
  }, {
    key: FELID.DESCRIPTION,
    label: '文字详情',
    type: components.Input,
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
    type: components.PicDetails,
    binding: {
      event: 'change'
    }
  }, {
    key: FELID.SP_PICTURE_CONTENT,
    label: '品牌商图片详情',
    type: components.SpPicDetails,
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
  }]
}, {
  title: '高级设置',
  children: [{
    key: FELID.LABEL_LIST,
    label: '推荐标签',
    type: components.ProductLabel,
    binding: {
      event: 'on-change'
    }
  }, {
    key: FELID.SALE_TIME,
    label: '售卖时间',
    type: components.SaleTime,
    binding: {
      event: 'on-change'
    }
  }, {
    key: FELID.LIMIT_SALE,
    label: '限购规则',
    type: components.PurchaseLimitation,
    options: {
      supportMultiPoi: false // TODO
    },
    binding: {
      event: 'change'
    },
    rules: [{
      result: {
        supportMultiPoi () {
          return !!this.getContext('features').supportMultiPoi
        }
      }
    }]
  }, {
    key: FELID.ATTRIBUTE_LIST,
    label: '商品属性',
    type: components.ProductAttributes,
    binding: {
      event: 'on-change'
    }
  },
  {
    key: FELID.SELL_STATUS,
    label: '上下架状态',
    type: 'Checkbox'
  }
  ]
}])
