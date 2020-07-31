import getEditPage from '../../edit-page-common/getEditPage'
import EditPage from './page.vue'
import Api from '../../edit-page-common/service'

console.log('212121')
export default getEditPage({ Component: EditPage })(Api)
