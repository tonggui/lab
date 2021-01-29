import {
  getQueryList,
  getCityList,
  registerDelete
} from '@/data/api/medicineRegister'

export default {
  product: {
    getList: getQueryList,
    delete: registerDelete,
    getCityList: getCityList
  }
}
