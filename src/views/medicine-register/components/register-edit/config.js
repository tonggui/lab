export const formData = {
  cityId: '',
  purchaseType: '',
  matchingRules: '',
  productInfo: ''
}

export const formRules = {
  cityId: { required: true, type: 'number', message: '请选择城市', trigger: 'change' },
  purchaseType: { required: true, type: 'number', message: '请选择购买方式要求', trigger: 'change' },
  matchingRules: { required: true, type: 'number', message: '请选择药品限制方式', trigger: 'change' },
  productInfo: { required: true, message: '请按要求填写商品信息', trigger: 'blur' }
}

export const productInfoTipsMap = {
  1: '请录入商品名称关键词，不同关键词之间用英文逗号隔开，最多可录入1万个字符；',
  2: '请录入商品upc，不同upc之间用英文逗号隔开，最多可录入1万个upc；'
}
