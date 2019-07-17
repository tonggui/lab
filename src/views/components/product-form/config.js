/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
import { assignToSealObject } from '@/components/dynamic-form/util'

export default () => {
  return [
    {
      layout: 'FormCard',
      title: '快捷新建',
      children: [
        {
          key: 'upc',
          layout: null,
          type: 'ChooseProduct',
          value: '',
          options: {
            style: 'padding: 0 20px 20px;'
          },
          events: {
            'on-change' (upc) {
              this.formData.upc = upc
            },
            'on-select-product' (product) {
              if (product) {
                this.formData.categoryAttrs = product.categoryAttrValueMap
                const attrList = product.categoryAttrList || []
                this.context.sellAttributes = attrList.filter(attr => attr.attrType === 2)
                this.context.categoryAttributes = attrList.filter(attr => attr.attrType !== 2)
                assignToSealObject(this.formData, product)
              }
            }
          }
        }
      ],
      rules: [
        {
          result: {
            title () { return `快捷${this.context.modeString}` },
            tip () { return `提高${this.context.modeString}商品效率` },
            visible () {
              return this.formData.name !== '123'
            }
          }
        }
      ]
    },
    {
      layout: 'FormCard',
      title: '基本信息',
      tip: '填写基本的商品信息，有利于增强商品流量，促进购买转换！',
      children: [
        {
          key: 'name',
          type: 'Input',
          label: '商品名称',
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
          events: {
            'on-change' ($event) {
              this.formData.name = $event.target.value
            }
          },
          options: {
            clearable: true,
            placeholder: '请输入商品标题'
          }
        },
        {
          key: 'tagList',
          type: 'TagList',
          label: '店内分类',
          value: [],
          options: {
            source: [],
            maxCount: 1,
            separator: ' > ',
            placeholder: '请输入或点击选择'
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
                  return this.context.maxTagCount
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
          options: {
            placeholder: '请输入或点击选择'
          },
          events: {
            'on-change' (category) {
              this.formData.category = category
            }
          }
        },
        {
          key: 'brand',
          type: 'Brand',
          label: '商品品牌',
          value: {},
          events: {
            'on-change' (brand) {
              this.formData.brand = brand
            }
          }
        },
        {
          key: 'origin',
          type: 'Origin',
          label: '产地',
          value: {},
          events: {
            change (origin) {
              this.formData.origin = origin
            }
          }
        },
        {
          key: 'pictures',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          description: ({
            render () {
              return (
                <span>
                图片支持1:1（600px*600px）/ 4:3（600px*450px），最多上传5张图 <a href="http://collegewm.meituan.com/post/detail/1415"
                    target="_blank">查看详细说明 &gt;</a>
                </span>
              )
            }
          }),
          value: []
        },
        {
          key: 'categoryAttrs',
          type: 'CategoryAttrs',
          label: '',
          value: {},
          options: {
            attrs: []
          },
          events: {
            change (data) {
              this.formData.categoryAttrs = data
            }
          },
          rules: [
            {
              result: {
                'options.attrs' () {
                  return this.context.categoryAttributes
                }
              }
            }
          ]
        }
      ]
    },
    {
      layout: 'FormCard',
      title: '售卖信息',
      tip: '填写售卖信息有助于买家更快的下单，库存为0的在买家端不展示',
      children: [
        {
          key: 'skuList',
          type: 'Input',
          label: '售卖属性',
          value: ''
        }
      ]
    },
    {
      layout: 'FormCard',
      title: '售卖信息',
      children: [
        {
          key: 'attributes',
          type: 'ProductAttributes',
          label: '商品属性',
          value: [],
          events: {
            'on-change' (attrs) {
              this.formData.attributes = attrs
            }
          }
        },
        {
          key: 'saleTime',
          type: 'SaleTime',
          label: '可售时间',
          value: undefined
        },
        {
          key: 'labels',
          type: 'ProductLabel',
          label: '商品标签',
          value: []
        },
        {
          key: 'minOrderCount',
          type: 'Input',
          label: '最小购买量',
          required: true,
          value: '1'
        },
        {
          key: 'description',
          type: 'Input',
          label: '商品描述',
          value: '',
          options: {
            type: 'textarea',
            placeholder: '请填写商品的核心卖点，200字以内'
          }
        },
        {
          key: 'picContent',
          type: 'Input',
          label: '图片详情',
          value: '',
          visible: false,
          options: {
            type: 'textarea'
          }
        }
      ]
    }
  ]
}
