<template>
  <SearchCascader
    :value="value"
    :source="cascader ? handleCascader : source"
    :arrow="cascader"
    :separator="separator"
    allow-branch-select
    trigger-mode="hover"
    :onSearch="handleSearch"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template slot="empty"><slot name="empty"></slot></template>
  </SearchCascader>
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
      value: [Array, Object, String],
      cascader: Boolean,
      separator: String,
      onSearch: {
        type: Function,
        required: true
      },
      onLoadMenu: Function
    },
    methods: {
      async handleSearch ({ keyword, pageSize, pageNum }) {
        const { data, total } = await this.onSearch({ keyword, pageSize, pageNum })
        const result = data.map((item) => {
          const {
            id,
            idPath,
            namePath,
            isLeaf,
            text,
            textEffected
          } = item
          const path = idPath.map((v, i) => ({
            id: v,
            name: namePath[i] || ''
          }))
          return {
            id,
            name: namePath.join(this.separator),
            path,
            isLeaf,
            text,
            textEffected
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
