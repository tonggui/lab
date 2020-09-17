import getEditPage from '../edit-page-common/getEditPage'
import EditPage from './index.vue'
import Api from '../edit-page-common/service'

export default getEditPage({ Component: EditPage })(Api)
