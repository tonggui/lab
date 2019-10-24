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
    label: '品牌图',
    required: true,
    value: '',
    description: '请上传有品牌LOGO或文字的商品图片',
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
    label: '品牌链接截图',
    value: '',
    description: '国内品牌请将中国商标网对应的查询结果截图',
    events: {
      change (v) {
        this.setData('brandUrl', v)
      }
    }
  }
]
