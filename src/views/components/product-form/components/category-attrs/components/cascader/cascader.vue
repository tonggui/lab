<template>
  <SearchCascader
    :value="value"
    :source="cascader ? handleCascader : source"
    :showSearch="showSearch"
    :multiple="multiple"
    :maxCount="maxCount"
    :arrow="cascader"
    :separator="separator"
    allow-branch-select
    trigger-mode="hover"
    :width="width"
    :onSearch="handleSearch"
    v-on="$listeners"
  />
</template>

<script>
  import SearchCascader from './search-cascader'

  export default {
    name: 'CategoryAttributeBaseCascader',
    components: {
      SearchCascader
    },
    props: {
      source: Array,
      value: [Array, Object],
      showSearch: Boolean,
      multiple: Boolean,
      maxCount: Number,
      cascader: Boolean,
      separator: String,
      onSearch: {
        type: Function,
        required: true
      },
      onLoadMenu: Function,
      width: Number
    },
    methods: {
      async handleSearch ({ keyword, pageSize, pageNum }) {
        const { data, total } = await this.onSearch({ keyword, pageSize, pageNum })
        const result = data.map((item) => {
          const {
            id,
            idPath,
            namePath,
            leaf
          } = item
          const path = idPath.map((v, i) => ({
            id: v,
            name: namePath[i] || ''
          }))
          return {
            id,
            name: namePath.join(this.separator),
            path,
            leaf
          }
        })
        return { data: result, total }
      },
      async handleCascader (parentId = 0) {
        const { data, total } = await this.onLoadMenu(parentId)
        return {
          id: parentId,
          children: data,
          total
        }
      }
    }
  }
</script>
