<template>
  <div class="search">
    <Search v-bind="$attrs" @search="handleSearch" :placeholder="placeholder" :fetch-data="getSuggestionList" />
  </div>
</template>
<script>
  import {
    fetchGetSearchSuggestion
  } from '@/data/repos/merchantProduct'
  import Search from '@components/search-suggest'

  export default {
    name: 'product-search-suggestion-container',
    props: {
      placeholder: {
        type: String,
        default: '商品名称/品牌/条码/货号'
      }
    },
    components: {
      Search
    },
    methods: {
      async getSuggestionList (keyword) {
        const list = await fetchGetSearchSuggestion(keyword)
        return list
      },
      handleSearch (item) {
        this.$emit('search', item)
      }
    }
  }
</script>
<style lang="less" scoped>
  .search {
    margin-right: 20px;
  }
</style>
