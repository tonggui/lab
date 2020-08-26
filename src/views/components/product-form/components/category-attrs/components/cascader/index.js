import BaseCascader from './cascader'
import Vue from 'vue'

import { fetchGetCategoryAttrListByName, fetchGetCategoryAttrListByParentId } from '@/data/repos/category'

export const buildCascaderWithApi = ({
  fetchCategoryAttrListByName = fetchGetCategoryAttrListByName,
  fetchCategoryAttrListByParentId = fetchGetCategoryAttrListByParentId
}) => Vue.extend({
  name: 'CategoryAttributeCascader',
  components: {
    BaseCascader
  },
  props: {
    source: {
      type: Array,
      default: () => []
    },
    attr: {
      type: Object,
      required: true
    }
  },
  methods: {
    async handleSearch ({ keyword }) {
      if (!keyword) {
        return []
      }
      const data = await fetchCategoryAttrListByName(this.attr, { keyword })
      return data
    },
    async handleCascader (parentId = 0, pagination = {}) {
      const data = await fetchCategoryAttrListByParentId(parentId, this.attr, {
        pageSize: 20,
        ...pagination,
        current: 1
      })
      return data
    }
  },
  render (createElement, context) {
    const children = []
    if (this.$scopedSlots.empty) {
      children.push(createElement('template', { slot: 'empty' }, [this.$scopedSlots.empty()]))
    }
    return createElement(BaseCascader, {
      attrs: {
        ...this.$attrs,
        onSearch: this.handleSearch,
        onLoadMenu: this.handleCascader
      },
      on: this.$listeners,
      children
    })
  }
})

export default buildCascaderWithApi({})
