<template>
  <BaseCascader
    v-bind="$attrs"
    :on-search="handleSearch"
    :on-load-menu="handleCascader"
    @open="$emit('start')"
    @close="$emit('end')"
    v-on="$listeners"
  >
    <template slot="empty"><slot name="empty"></slot></template>
  </BaseCascader>
</template>

<script>
  import BaseCascader from './cascader'

  import { fetchGetCategoryAttrListByName, fetchGetCategoryAttrListByParentId } from '@/data/repos/category'

  export default {
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
        const data = await fetchGetCategoryAttrListByName(this.attr, { keyword })
        return data
      },
      async handleCascader (parentId = 0, pagination = {}) {
        const data = await fetchGetCategoryAttrListByParentId(parentId, this.attr, {
          pageSize: 20,
          ...pagination,
          current: 1
        })
        return data
      }
    }
  }
</script>
