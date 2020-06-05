import Vue from 'vue'
import lxPageView from './pv'
import lxModuleClick from './mc'
import lxModuleView from './mv'
import lxModuleScroll from './ms'

Vue.directive('pv', lxPageView)
Vue.directive('mc', lxModuleClick)
Vue.directive('mv', lxModuleView)
Vue.directive('ms', lxModuleScroll)
