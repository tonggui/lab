import Vue from 'vue'
import ModuleManage, { Module } from './vue'
import source from './source'
import module from './module'
export { TYPES } from './module'

Vue.use(ModuleManage)

export default new Module({
  source,
  module
})
