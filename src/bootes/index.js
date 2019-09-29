/**
 * 对于bootes某些组件的包装
 * 以及项目中普遍的公共组件
*/
import Vue from 'vue'
import Bootes from '@sfe/bootes'

import Icon from '@/components/icon/icon' // icon 扩展
import Empty from '@/components/empty' // 全局的空状态组件
import ProductEmpty from '@/components/empty/product-empty' // 商品列表空状态展示组件
import ErrorBoundary from '@/components/error-boundary' // errorBoundary 组件
import InputNumber from '@/components/input-number' // fix bootes inputNumber组件
import Pagination from '@/components/pagination' // fix bootes page组件
import Modal from '@/components/modal' // fix bootes modal组件
import Drawer from '@/components/drawer' // fix bootes drawer组件

// TODO 是否考虑 bootes 是否按需引入
Vue.use(Bootes)
Vue.component('Icon', Icon)
Vue.component('Empty', Empty)
Vue.component('ProductEmpty', ProductEmpty)
Vue.component('InputNumber', InputNumber)
Vue.component('ErrorBoundary', ErrorBoundary)
Vue.component('Pagination', Pagination)
Vue.component('Modal', Modal)
Vue.component('Drawer', Drawer)
