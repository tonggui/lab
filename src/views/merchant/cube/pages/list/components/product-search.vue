<template>
  <div class="search-container">
    <Search @search="handleSearch" :placeholder="placeholder" :fetch-data="getSuggestionList" :width="300" :value="searchValue" />
  </div>
</template>
<script>
  import {
    fetchRecommendSearchSuggestion
  } from '@/data/repos/product'
  import Search from '@components/search-suggest'

  export default {
    name: 'product-search-suggestion-container',
    props: {
      placeholder: {
        type: String,
        default: '商品名称/品牌/UPC/EAN'
      },
      searchValue: {
        type: String,
        default: ''
      }
    },
    components: {
      Search
    },
    methods: {
      async getSuggestionList (keyword) {
        const list = await fetchRecommendSearchSuggestion(keyword)
        return list
      },
      handleSearch (item) {
        this.$emit('on-search', item)
      }
    }
  }
</script>
<style lang="less" scoped>
  .search-container {
    margin-right: 20px;
  }
</style>
