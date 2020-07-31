import getEditPage from '../../edit-page-common/getEditPage'
import EditPage from './page.vue'
import Api from '../../edit-page-common/service'

export default getEditPage({ Component: EditPage })(Api)
