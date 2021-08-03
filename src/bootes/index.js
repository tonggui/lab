/**
 * 对于bootes某些组件的包装
 * 以及项目中普遍的公共组件
*/
import Vue from 'vue'
import Bootes from '@roo-design/roo-vue'
// import withPopper from '@/hoc/withPopper'

import Icon from '@/components/icon/icon' // icon 扩展
import Loading from '@/components/loading' // flash-loading
import Empty from '@/components/empty' // 全局的空状态组件
import ProductEmpty from '@/components/empty/product-empty' // 商品列表空状态展示组件
import ErrorBoundary from '@/components/error-boundary' // errorBoundary 组件
import InputNumber from '@/components/input-number' // fix bootes inputNumber组件
import Pagination from '@/components/pagination' // fix bootes page组件
import Modal from '@/components/modal' // fix bootes modal组件
import Drawer from '@/components/drawer' // fix bootes drawer组件
import Tooltip from '@/components/tooltip' // fix tooltip keep-alive 不销毁的问题
import EmptyDefaultShow from '@/components/empty-default-show'
import IconItem from '@components/header-bar/components/IconItem'
import RouteLink from '@components/link/link'
import LinkItem from '@components/header-bar/components/LinkItem'
import PermissionBtn from '@/views/components/permission-bth'
import DropDown from '@/components/drop-down/dropdown'
// import Poptip from '@/components/poptip'

// TODO 是否考虑 bootes 是否按需引入
Vue.use(Bootes)
Vue.component('Icon', Icon)
Vue.component('Loading', Loading)
Vue.component('Empty', Empty)
Vue.component('ProductEmpty', ProductEmpty)
Vue.component('InputNumber', InputNumber)
Vue.component('ErrorBoundary', ErrorBoundary)
Vue.component('Pagination', Pagination)
Vue.component('Modal', Modal)
Vue.component('Drawer', Drawer)
Vue.component('Tooltip', Tooltip)
Vue.component('EmptyDefaultShow', EmptyDefaultShow)
// Vue.component('Poptip', Poptip) 处理代码被意外合并的问题
Vue.component('Dropdown', DropDown)

// 权限按钮涉及的相关组件需要全局注册
Vue.component('IconItem', IconItem)
Vue.component('RouteLink', RouteLink)
Vue.component('LinkItem', LinkItem)
Vue.component('PermissionBtn', PermissionBtn)

Vue.prototype.$Modal = Modal
