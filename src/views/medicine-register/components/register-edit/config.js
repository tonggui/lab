const getValidateProductInfo = context => (rule, value, callback) => {
  console.log(rule)
  if (value === '') {
    callback(new Error('请按要求填写商品信息'))
  } else if (context.formData.matchingRules === 1 && value.length > 10000) {
    callback(new Error('商品信息总字数超过1万，配置失败，请修改后重新提交。'))
  } else if (context.formData.matchingRules === 2 && (value.split(',').length > 500 || value.length > 15 * 10000)) {
    callback(new Error('录入的UPC个数超过500个或总字数超过15万，配置失败，请修改后重新提交。'))
  } else {
    callback()
  }
}

const getValidateMatchRule = context => (rule, value, callback) => {
  if (!value || value !== 2) {
    callback(new Error('请选择商品限制方式'))
  } else {
    callback()
  }
}

export const formData = {
  cityId: '',
  purchaseType: '',
  matchingRules: 2, // 默认只支持upc添加
  productInfo: ''
}

export const getFormRules = (context) => ({
  cityId: { required: true, type: 'number', message: '请选择城市', trigger: 'change' },
  purchaseType: { required: true, type: 'number', message: '请选择购买方式要求', trigger: 'change' },
  matchingRules: { required: true, validator: getValidateMatchRule(context), trigger: 'change' },
  productInfo: { required: true, validator: getValidateProductInfo(context), trigger: 'blur' }
})

export const productInfoTipsMap = {
  1: '请录入商品名称关键词，不同关键词之间用英文逗号隔开，最多可录入1万个字；',
  2: '请录入商品upc，不同upc之间用英文逗号隔开，最多可录入500个upc，不得超过15万个字；'
}
