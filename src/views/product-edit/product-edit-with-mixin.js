import Vue from 'vue'
import withCategoryTemplate from '@/views/category-template'
import ProductEdit from './product-edit2'

const mixinInject = (Mixin = null, Component) => {
  if (!Mixin) throw Error('请传入mixin')
  return Vue.extend({
    mixins: [Mixin],
    ...Component
  })
}

export default (mixin) => {
  const component = mixinInject(mixin, ProductEdit)
  return withCategoryTemplate(component)
}
