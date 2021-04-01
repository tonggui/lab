<template>
  <div class="search-container">
    <Search
      class="search-box"
      ref="search"
      :disabled="disabled"
      :placeholder="placeholder"
      :fetch-data="getSuggestionList"
      :needSuggest="false"
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
        const name = item.name || item
        this.$emit('search', name)
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
  .search-container {
    margin-right: 20px;
    margin-top: -3px;
  }
</style>
