import Vue from 'vue'
import store from '@/store'
import setAutoClearStockStore from './store'
import restrictedPurchase from './restricted-purchase'

store.registerModule('restricted-purchase', setAutoClearStockStore)

export default Vue.extend(restrictedPurchase)
