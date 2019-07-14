<template>
  <Layout>
    <ListHeader slot="header" class="header" />
    <TagList
      slot="tag-list"
      :sorting="sorting"
      :currentTag="currentTag"
      @select="handleTagChange"
      @open-sort="handleStartSort"
    />
    <ProductListTable
      slot="product-list"
      :sorting="sorting"
      :tagId="tagId"
      :smartSortSwitch="currentTag.smartSortSwitch"
    />
    <ListFooter slot="footer" class="footer" />
  </Layout>
</template>

<script>
  import {
    allProductTag
  } from '@/data/constants/poi'
  import ListHeader from './components/list-header'
  import ListFooter from './components/list-footer'
  import TagList from './components/tag-list'
  import ProductListTable from './components/product-table-list'
  import Layout from '@/views/components/layout/product-list'

  export default {
    name: 'product-list',
    data () {
      return {
        sorting: false, // 排序模式中
        currentTag: allProductTag // 当前的tag
      }
    },
    computed: {
      tagId () {
        return this.currentTag.id
      }
    },
    components: {
      Layout,
      ListHeader,
      ListFooter,
      TagList,
      ProductListTable
    },
    methods: {
      handleTagChange (tag) {
        this.currentTag = tag
      },
      handleStartSort () {
        this.sorting = true
      }
    }
  }
</script>
<style lang="less" scoped>
.header {
  margin-bottom: 10px;
}
.footer {
  margin-top: 10px;
}
</style>
