import {
  getQueryList,
  getCityList,
  registerDelete,
  registerUpdate
} from '@/data/api/medicineRegister'

export default {
  product: {
    getList: getQueryList,
    delete: registerDelete,
    modify: registerUpdate,
    getCityList: getCityList
  }
}
