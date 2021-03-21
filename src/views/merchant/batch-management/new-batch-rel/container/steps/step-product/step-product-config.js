import TagWithDataSelected from '../../category-select/tag-with-data-selected'
import BathRuleSelect from '../../../components/batch-rule-selected'
import RelSample from '../../../components/rel-sample'

export const productInitValue = {
  dataSourceType: 'parts',
  productSelect: 'category',
  productData: {},
  dataSourceValues: [],
  syncType: '',
  batchType: ''
}

const configs = [{
  label: '所要关联之门店的商品',
  id: 'dataSourceType',
  show: true,
  component: null,
  data: [{
    label: 'all',
    name: '全部商品'
  }, {
    label: 'parts',
    name: '指定商品'
  }]
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
    tip: '除价格、库存的信息'
  }]
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
  component: TagWithDataSelected
}, {
  label: '',
  id: 'dataSourceValues',
  show (data) {
    return data['dataSourceType'] === 'parts' && data['productSelect'] === 'batch'
  },
  component: BathRuleSelect,
  data (data) {
    console.log('data', data)
    return {
      type: data['dataSourceType'],
      value: data['dataSourceValues'] || []
    }
  }
}, {
  label: '关联后商品信息更新范围',
  id: 'syncType',
  component: null,
  show: true,
  data: [{
    label: 'all',
    name: '全部信息'
  }, {
    label: 'exclude',
    name: '除价格、库存的信息',
    tip: '除价格、库存的信息'
  }, {
    label: 'poiOnly',
    name: '仅关联门店商品，不更新商品信息',
    tip: '除价格、库存的信息'
  }]
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
