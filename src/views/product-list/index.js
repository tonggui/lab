import Vue from 'vue'
import store from '@/store'
import productListStore from './store'
import ProductListPage from './product-list-page'

store.registerModule('productList', productListStore)

export default Vue.extend(ProductListPage)
