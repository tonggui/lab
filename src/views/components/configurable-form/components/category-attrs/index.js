import Vue from 'vue'
import create from './create'
import { isFunction } from 'lodash'

import CategoryAttrText from '@/views/components/product-form/components/category-attrs/components/text'
import CategoryAttrSelect from '@/views/components/product-form/components/category-attrs/components/selector'
import CategoryAttrCascader from '@/views/components/product-form/components/category-attrs/components/cascader'
import CategoryAttrBrand from '@/views/components/product-form/components/category-attrs/components/brand'

const DefaultCascaderComponentMap = {
  CategoryAttrText,
  CategoryAttrSelect,
  CategoryAttrCascader,
  CategoryAttrBrand
}

export const buildCategoryAttrsContainer = ({ components = {}, fieldConfig = {} }) => Vue.extend({
  name: 'category-attrs-container',
  created () {
    this.component = create({ components: Object.assign({}, DefaultCascaderComponentMap, components), fieldConfig })
  },
  methods: {
    validate () {
      const $component = this.$refs.component
      if ($component && isFunction($component.validate)) {
        return $component.validate()
      }
    }
  },
  render (h) {
    window.cc = this
    console.log(JSON.stringify(this.$attrs.value))
    return h(this.component, {
      ref: 'component',
      attrs: { ...this.$attrs },
      on: { ...this.$listeners }
    })
  }
})

export default buildCategoryAttrsContainer({})
