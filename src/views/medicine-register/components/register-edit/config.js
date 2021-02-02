const getValidateProductInfo = context => (rule, value, callback) => {
  console.log(rule)
  if (value === '') {
    callback(new Error('请按要求填写商品信息'))
  } else if (context.formData.matchingRules === 1 && value.length > 10000) {
    callback(new Error('商品信息总字数超过1万，该条配置失败，请修改后重新提交。'))
  } else if (context.formData.matchingRules === 2 && (value.split(',').length > 4000 || value.length > 15 * 10000)) {
    callback(new Error('upc个数超过4000个或总字数超过15万，该条配置失败，请修改后重新提交。'))
  } else {
    callback()
  }
}

export const formData = {
  cityId: '',
  purchaseType: '',
  matchingRules: '',
  productInfo: ''
}

export const getFormRules = (context) => ({
  cityId: { required: true, type: 'number', message: '请选择城市', trigger: 'change' },
  purchaseType: { required: true, type: 'number', message: '请选择购买方式要求', trigger: 'change' },
  matchingRules: { required: true, type: 'number', message: '请选择药品限制方式', trigger: 'change' },
  productInfo: { validator: getValidateProductInfo(context), trigger: 'blur' }
})

export const productInfoTipsMap = {
  1: '请录入商品名称关键词，不同关键词之间用英文逗号隔开，最多可录入1万个字符；',
  2: '请录入商品upc，不同upc之间用英文逗号隔开，最多可录入4000个upc；'
}
