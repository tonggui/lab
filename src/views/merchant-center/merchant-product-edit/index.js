import getEditPage from '../../merchant/edit-page-common/getEditPage'
import EditPage from './page.vue'
import Api from '../../merchant/edit-page-common/service'

export default getEditPage({ Component: EditPage })(Api)
