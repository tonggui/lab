import getEditPage from '../edit-page-common/getEditPage'
import EditPage from './index.vue'
import Api from './service'

export default getEditPage({
  Component: EditPage
})(
  Api
)
