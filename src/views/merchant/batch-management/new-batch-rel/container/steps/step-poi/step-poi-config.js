import PoiSelect from '../../../components/poi-select'

const configs = [{
  label: '选择关联门店',
  id: 'poiSelect',
  show: true,
  component: null,
  data: [{
    label: 'all',
    name: '全部门店'
  }, {
    label: 'parts',
    name: '指定门店'
  }]
}, {
  label: '',
  id: 'poiList',
  show (data) {
    return data['poiSelect'] === 'parts'
  },
  data (data) {
    return {
      value: data['poiList'] || []
    }
  },
  component: PoiSelect
}]

export default configs
