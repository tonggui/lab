import Vue from 'vue'
import store from '@/store'
import productListStore from './store'
import ProductList from './product-list'

store.registerModule('productList', productListStore)

export default Vue.extend(ProductList)
