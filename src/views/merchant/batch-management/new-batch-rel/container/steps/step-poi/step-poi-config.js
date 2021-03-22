import PoiSelect from '../../../components/poi-select'

export const poiInitValue = {
  poiList: [],
  poiSelect: ''
}

const configs = [
//   {
//   label: '选择关联门店',
//   id: 'poiSelect',
//   show: true,
//   component: null,
//   data: [{
//     label: 'all',
//     name: '全部门店'
//   }, {
//     label: 'parts',
//     name: '指定门店'
//   }]
// },
  {
    label: '选择关联门店',
    id: 'poiList',
    show: true,
    data (data) {
      return {
        value: data['poiList'] || []
      }
    },
    component: PoiSelect,
    validator (data) {
      const { poiList } = data
      if (!poiList.length) return '请选择关联门店'
      else return true
    }
  }]

export default configs
