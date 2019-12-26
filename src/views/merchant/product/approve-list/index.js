import Vue from 'vue'
import store from '@/store'
import approveListStore from './store'
import ApproveListPage from './approve-list-page'

store.registerModule('merchant-approve-list', approveListStore)

export default Vue.extend(ApproveListPage)
