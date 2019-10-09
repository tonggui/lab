import Vue from 'vue'
import ModuleManage, { Module } from '@/module//module-manage/vue'
import source from './source'
import module from './module'

Vue.use(ModuleManage)

export default new Module({
  source,
  module
})
