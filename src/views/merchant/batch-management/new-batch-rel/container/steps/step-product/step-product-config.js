import TagWithDataSelected from '../../category-select/tag-with-data-selected'
import BathRuleSelect from '../../../components/batch-rule-selected'
import RelSample from '../../../components/rel-sample'

export const productInitValue = {
  dataSourceType: 'all',
  productSelect: 'category',
  productData: {},
  dataSourceValues: [],
  syncType: 'exclude',
  batchType: ''
}

const configs = [{
  label: '选择想要关联至门店的商品',
  id: 'dataSourceType',
  show: true,
  component: null,
  data: [{
    label: 'all',
    name: '全部商品'
  }, {
    label: 'parts',
    name: '指定商品'
  }],
  validator (data) {
    const { dataSourceType } = data
    if (!dataSourceType) return '请选择商品'
    else return true
  }
}, {
  label: '商品选择方式',
  id: 'productSelect',
  show (data) {
    return data['dataSourceType'] === 'parts'
  },
  component: null,
  data: [{
    label: 'category',
    name: '按分类选择'
  }, {
    label: 'batch',
    name: '批量导入选择',
    tip: {
      type: 'guide',
      keyName: 'BATCH_IMPORT_TIP',
      content: '一次性粘贴多个想要选择的商品，输入“条形码/货号/商品名称”即可批量选择',
      transfer: true,
      'max-width': 300,
      placement: 'top'
    }
  }],
  validator (data) {
    const { dataSourceType, productSelect } = data
    if (dataSourceType === 'parts' && !productSelect) return '请选择商品'
    else return true
  }
}, {
  label: '',
  id: 'category',
  show (data) {
    return data['dataSourceType'] === 'parts' && data['productSelect'] === 'category'
  },
  data (data) {
    return {
      productData: data['productData']
    }
  },
  component: TagWithDataSelected,
  validator (data) {
    const { dataSourceType, productSelect, productData } = data
    if (dataSourceType === 'parts' && productSelect === 'category' && !Object.keys(productData).length) return '请选择商品'
    else return true
  }
}, {
  label: '',
  id: 'dataSourceValues',
  show (data) {
    return data['dataSourceType'] === 'parts' && data['productSelect'] === 'batch'
  },
  component: BathRuleSelect,
  data (data) {
    return {
      type: `${data['batchType']}`,
      value: data['dataSourceValues'] || []
    }
  },
  validator (data) {
    const { dataSourceType, productSelect, batchType, dataSourceValues } = data
    if (dataSourceType === 'parts' && productSelect === 'batch' && (!batchType || (batchType && !dataSourceValues.length))) return '请填写批量导入商品'
    else return true
  }
}, {
  label: '选择商品信息更新范围',
  id: 'syncType',
  component: null,
  show: true,
  data: [{
    label: 'all',
    name: '全部信息'
  }, {
    label: 'exclude',
    name: '除价格、库存的信息',
    tip: {
      content: '适⽤场景：适用于商品价格、库存由分店设置的管理模式或价格、库存由系统对接更新的。选择此选项后，本次批量关联将总部与门店相同商品建立关联（相同UPC、店内码或商品标题认为是相同商品），仅更新商品基础信息，不更新价格、库存。\n' +
        '特殊说明：若分店⽆某⼀商品，关联成功后默认在分店新建此商品，该商品的价格为总部商品价格，库存为0。',
      transfer: true,
      'max-width': 300,
      placement: 'top'
    }
  }, {
    label: 'poiOnly',
    name: '仅关联门店商品，不更新商品信息',
    tip: {
      content: '适⽤场景：适用于所有商品信息由分店⾃⾏管理的模式。选择此选项后本次批量关联仅将总部与门店相同商品建立关联（相同UPC、店内码或商品标题认为是相同商品），不会更新分店已有商品的所有信息（包括价格、库存）。\n' +
        '特殊说明：若分店⽆某⼀商品，关联成功后默认在分店新建此商品，该商品的价格为总部商品价格，库存为0。',
      transfer: true,
      'max-width': 300,
      placement: 'top'
    }
  }],
  validator (data) {
    const { syncType } = data
    if (!syncType) return '请选择商品信息更新范围'
    else return true
  }
}, {
  label: '',
  id: 'sample',
  show: true,
  component: RelSample,
  data (data) {
    return {
      type: data.syncType
    }
  }
}]

export default configs
