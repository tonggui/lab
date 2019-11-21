export const EXCEL_TYPE = {
  STANDARD: 'standard',
  CUSTOM: 'custom'
}

export const normalExcel = [{
  type: EXCEL_TYPE.STANDARD,
  title: '适用于条码商品（填写内容较少） ',
  link: '',
  extraLink: {
    link: '',
    linkName: '商品类目id表.xls',
    name: '《商品库使用声明》',
    onClick: (e) => { e.preventDefault() }
  },
  linkName: '条码匹配商品库商品表格.xls',
  description: '默认使用商品库信息（标题、图片、规格等），可自行修改'
}, {
  type: EXCEL_TYPE.CUSTOM,
  title: '适用于所有商品（条码商品在商品库没有时，可采用） ',
  link: '',
  linkName: '自行创建商品表格.xls'
}]

export const medicineExcel = [{
  title: '通过美团点评商品库快速获取药品',
  link: '',
  linkName: '通过条码匹配美团药品库.xls'
}]
