import Vue from 'vue'
import store from '@/store'
import searchListStore from './store'
import SearchList from './search-list'

// TODO 自测不会重复注册
store.registerModule('searchList', searchListStore)

export default Vue.extend(SearchList)
