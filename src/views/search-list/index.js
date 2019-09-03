import Vue from 'vue'
import store from '@/store'
import searchListStore from './store'
import SearchList from './search-list'

store.registerModule('searchList', searchListStore)

export default Vue.extend(SearchList)
