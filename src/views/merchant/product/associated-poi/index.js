import Vue from 'vue'
import AssociatedPoiPage from './associated-poi-page'
import { register } from './store'

// 注册模块
register()

export default Vue.extend(AssociatedPoiPage)
