import Vue from 'vue'
import ModulePlugin, { ModuleManage } from '@/module/module-manage/vue'
import source from './source'
import module from './module'
import productModule from './subModule/product'

Vue.use(ModulePlugin)

export default new ModuleManage({
  source,
  module,
  subModule: {
    product: productModule
  }
})
