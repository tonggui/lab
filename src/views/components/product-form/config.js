/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
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
          value: ''
        },
        {
          key: 'tagList',
          type: 'Input',
          label: '店内分类',
          value: ''
        },
        {
          key: 'category',
          type: 'Input',
          label: '商品类目',
          value: ''
        },
        {
          key: 'brand',
          type: 'Input',
          label: '商品品牌',
          value: ''
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
          key: 'skus',
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
          type: 'Input',
          label: '可售时间',
          value: ''
        },
        {
          key: 'labels',
          type: 'Input',
          label: '商品标签',
          value: ''
        },
        {
          key: 'minOrderCount',
          type: 'Input',
          label: '最小购买数量',
          required: true,
          value: '1'
        },
        {
          key: 'description',
          type: 'Input',
          label: '商品描述',
          value: '',
          options: {
            type: 'textarea'
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
