import Vue from 'vue'
import { register } from './store'
import CelluarMissingProductListPage from './celluar-missing-product-list'

register()

export default Vue.extend(CelluarMissingProductListPage)
