import Vue from 'vue'
import store from '@/store'
import productListStore from './store'
import ProductList from './product-list'

// TODO 自测不会重复注册
store.registerModule('productList', productListStore)

export default Vue.extend(ProductList)
