import getEditPage from '../edit-page-common/getEditPage'
import EditPage from './index.vue'
import Api from '../edit-page-common/service'
import { fetchGetAuditProductDetail } from '@/data/repos/product'

export default getEditPage({ Component: EditPage })({
  ...Api,
  fetchProductDetail: fetchGetAuditProductDetail
})
