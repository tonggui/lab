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
    <ProductList
      slot="product-list"
      :sorting="sorting"
      :tagId="currentTag.id"
    />
    <div slot="footer" v-if="sorting"><Button @click="handleCloseSort">完成</Button></div>
  </Layout>
</template>

<script>
  import ListHeader from './components/list-header/index'
  import TagList from './components/tag-list'
  import ProductList from './components/product-table-list'
  import Layout from '@/views/components/layout/product-list'
  import { allProductTag } from '@/data/constants/poi'

  export default {
    name: 'merchant-product-list',
    data () {
      return {
        sorting: false, // 排序模式中
        currentTag: allProductTag // 当前的tagId
      }
    },
    components: {
      Layout,
      ListHeader,
      TagList,
      ProductList
    },
    methods: {
      handleTagChange (tag) {
        this.currentTag = tag
      },
      handleStartSort () {
        this.sorting = true
      },
      handleCloseSort () {
        this.sorting = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .header {
    margin-bottom: 10px;
  }
</style>
