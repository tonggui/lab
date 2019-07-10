<template>
  <Layout>
    <ListHeader slot="header" class="header" />
    <!-- <TagList
      slot="tag-list"
      :sorting="sorting"
      :tagId="tagId"
      @select="handleTagIdChange"
      @open-sort="handleStartSort"
    /> -->
    <div slot="product-list">商品列表</div>
  </Layout>
</template>

<script>
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import ListHeader from './components/list-header/index'
  // import TagList from './components/tag-list'
  import Layout from '@/views/components/product-list/layout/page'

  export default {
    name: 'merchant-product-list',
    data () {
      return {
        sorting: false, // 排序模式中
        tagId: defaultTagId // 当前的tagId
      }
    },
    components: {
      Layout,
      ListHeader
      // TagList
    },
    methods: {
      handleTagIdChange (id) {
        this.tagId = id
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
</style>
