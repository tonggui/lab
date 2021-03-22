<template>
  <div class="search">
    <Search
      ref="search"
      :disabled="disabled"
      :placeholder="placeholder"
      :fetch-data="getSuggestionList"
      @search="handleSearch"
      @change="handleChange"
    />
  </div>
</template>
<script>
  // import {
  //   fetchGetSearchSuggestion
  // } from '@/data/repos/product'
  import Search from '@components/search-suggest'

  export default {
    name: 'product-search-suggestion-container',
    props: {
      disabled: Boolean,
      placeholder: {
        type: String,
        default: '条形码/货号/商品名称'
      },
      packageProduct: Number
    },
    components: {
      Search
    },
    methods: {
      async getSuggestionList (keyword) {
        // const list = await fetchGetSearchSuggestion(keyword, this.packageProduct)
        return []
      },
      handleSearch (item) {
        this.$emit('search', item)
      },
      handleChange (val) {
        this.$emit('change', val)
      },
      handleClear () {
        this.$refs['search'].handleChange('')
      }
    }
  }
</script>
<style lang="less" scoped>
  .search {
    margin-right: 20px;
  }
</style>
