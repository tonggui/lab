import getEditPage from '../../edit-page-common/getEditPage'
import EditPage from './page.vue'
import Api from '../../edit-page-common/service'
import { fetchGetAuditProductDetail } from '@/data/repos/merchantProduct' // 审核详情接口

export default getEditPage({ Component: EditPage })({
  ...Api,
  fetchProductDetail: fetchGetAuditProductDetail
})
