export default [
  {
    layout: 'ApplySection',
    options: {
      title: '商品图片'
    },
    children: [
      {
        key: 'pic',
        type: 'UploadGroup',
        required: true,
        emptyTip: '商品主图不能为空',
        value: [],
        options: {
          size: 3,
          descriptionList: ['商品主图', '商品背景图', '商品外包装图']
        },
        validate ({ value }) {
          if (!value || !value[0]) {
            return '商品主图不能为空'
          }
        },
        events: {
          change (v) {
            this.setData('pic', v)
            this.self.validate(this.self)
          }
        }
      }
    ]
  },
  {
    layout: 'ApplySection',
    options: {
      title: '申请的商品信息'
    },
    children: [
      {
        key: 'attrName',
        type: 'Input',
        label: '属性名称',
        required: true,
        value: '',
        options: {
          style: 'max-width: 440px;',
          placeholder: '例如：尺码、颜色、毫升'
        },
        validate ({ value }) {
          if (!value) {
            return '属性名称不能为空'
          }
        },
        events: {
          'on-change' (e) {
            this.setData('attrName', e.target.value)
            this.self.validate(this.self)
          }
        }
      },
      {
        key: 'attrValue',
        type: 'Input',
        label: '属性值',
        description: '允许同时申请多个属性值，请用“，”分隔开',
        value: '',
        options: {
          style: 'max-width: 440px;',
          placeholder: '例如：X，XL，红色，黑色'
        },
        events: {
          'on-change' (e) {
            this.setData('attrValue', e.target.value)
          }
        }
      }
    ]
  }
]
