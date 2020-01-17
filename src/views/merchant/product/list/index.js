import Vue from 'vue'
import { register } from './store'
import MerchantProductList from './merchant-product-list'

register()

export default Vue.extend(MerchantProductList)
