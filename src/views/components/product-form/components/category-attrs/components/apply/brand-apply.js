export default [
  {
    key: 'name',
    type: 'Input',
    label: '品牌名称',
    required: true,
    value: '',
    options: {
      style: 'max-width: 440px',
      placeholder: '请输入品牌名称'
    },
    events: {
      'on-change' (e) {
        this.setData('name', e.target.value)
        this.self.validate(this.self)
      }
    }
  },
  {
    key: 'logoPic',
    type: 'UploadBox',
    label: '品牌LOGO',
    required: true,
    value: '',
    description: '请上传品牌LOGO图或有清晰LOGO的商品图',
    events: {
      change (v) {
        this.setData('logoPic', v)
        this.self.validate(this.self)
      }
    }
  },
  {
    key: 'brandUrl',
    type: 'UploadBox',
    label: '商品图片',
    value: '',
    description: '请拍一张完整的真实商品图',
    events: {
      change (v) {
        this.setData('brandUrl', v)
      }
    }
  }
]
