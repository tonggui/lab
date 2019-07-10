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
          options: {
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
            separator: ' > ',
            placeholder: '请输入或点击选择'
          },
          rules: [
            {
              result: {
                'options.source' () {
                  return this.context.tagList
                }
              }
            }
          ]
        },
        {
          key: 'category',
          type: 'Input',
          label: '商品类目',
          value: '',
          options: {
            placeholder: '请输入或点击选择'
          }
        },
        {
          key: 'brand',
          type: 'Brand',
          label: '商品品牌',
          value: {}
        },
        {
          key: 'origin',
          type: 'Input',
          label: '产地',
          value: ''
        },
        {
          key: 'pictures',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          value: []
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
          type: 'Input',
          label: '商品属性',
          value: ''
        },
        {
          key: 'saleTime',
          type: 'SellTime',
          label: '可售时间',
          value: []
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
