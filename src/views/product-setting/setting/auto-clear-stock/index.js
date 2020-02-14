import Vue from 'vue'
import store from '@/store'
import setAutoClearStockStore from './store'
import autoClearStockPage from './auto-clear-stock-page'

store.registerModule('autoClearStockConfig', setAutoClearStockStore)

export default Vue.extend(autoClearStockPage)
