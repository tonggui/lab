import Vue from 'vue'
import { register } from './store'
import ProductListPage from './index.vue'

register()

export default Vue.extend(ProductListPage)
