<template>
  <ProductListPage>
    <div slot="header">
      <h1>搜索列表页</h1>
    </div>
    <TagList slot="tag-list" @select="handleTagChange" />
    <ProductTableList slot="product-list" />
  </ProductListPage>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import TagList from './container/tag-list'
  import ProductTableList from './container/product-table-list'

  const { mapActions } = createNamespacedHelpers('searchList')

  export default {
    name: 'search-list-conatiner',
    components: {
      ProductListPage,
      TagList,
      ProductTableList
    },
    methods: {
      ...mapActions(['getData']),
      ...mapActions({
        handleTagChange: 'changeTag'
      })
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less">
</style>
