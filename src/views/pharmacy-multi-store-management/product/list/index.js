import Vue from 'vue'
import { register } from './store'
import MultiStoreProductList from './multi-store-product-list'

register()
export default Vue.extend(MultiStoreProductList)
