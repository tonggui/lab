<template>
  <ProductListPage>
    <ListHeader slot="header" />
    <TagList
      slot="tag-list"
      :sorting="sorting"
      :current-tag="currentTag"
      @select="handleTagChange"
      @open-sort="handleStartSorting"
    />
    <ProductTableList
      slot="product-list"
      :sorting="sorting"
      :tagId="currentTag.id"
    >
      <template slot="empty">快去新建商品吧~</template>
    </ProductTableList>
    <ListFooter slot="footer" :sorting="sorting" @submit="handleEndSorting" />
  </ProductListPage>
</template>
<script>
  import {
    allProductTag
  } from '@/data/constants/poi'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ListHeader from './components/list-header'
  import ListFooter from './components/list-footer'
  import TagList from './components/tag-list'
  import ProductTableList from './components/product-table-list'

  export default {
    name: 'product-list-page',
    data () {
      return {
        sorting: false, // 排序模式中
        currentTag: { ...allProductTag } // 默认全部分类
      }
    },
    components: {
      ProductListPage,
      ListHeader,
      ListFooter,
      TagList,
      ProductTableList
    },
    methods: {
      handleStartSorting () {
        this.sorting = true
      },
      handleEndSorting () {
        this.sorting = false
      },
      handleTagChange (tag) {
        this.currentTag = tag
      }
    }
  }
</script>
