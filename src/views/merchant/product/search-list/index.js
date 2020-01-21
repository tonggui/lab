import Vue from 'vue'
import { register } from './store'
import MerchantSearchList from './merchant-search-list'

register()

export default Vue.extend(MerchantSearchList)
