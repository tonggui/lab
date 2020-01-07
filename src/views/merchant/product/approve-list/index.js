import Vue from 'vue'
import { register } from './store'
import ApproveListPage from './approve-list-page'

register()

export default Vue.extend(ApproveListPage)
