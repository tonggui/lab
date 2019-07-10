<template>
  <Layout>
    <TagList
      slot="tag-list"
      tagId="tagId"
      showSmartSort="showSmartSort"
      sorting="sorting"
      @fetch="$emit('fetch-tag', sorting)"
      @submit="(data) => $emit('submit-tag', sorting, data)"
    />
    <ProductList
      slot="product-list"
      tagId="tagId"
      showSmartSort="showSmartSort"
      sorting="sorting"
      @fetch="$emit('fetch-tag', sorting)"
      @submit="(data) => $emit('submit-tag', sorting, data)"
    />
  </Layout>
</template>

<script>
  import {
    defaultTagId
  } from '@/data/constants/poi'
  import Layout from './layout'
  import TagList from './tag-list'
  import ProductList from './product-table-list'

  export default {
    name: 'product-list-container',
    props: {
      showSmartSort: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        sorting: false, // 排序模式中
        tagId: defaultTagId // 当前的tagId
      }
    },
    components: {
      TagList,
      ProductList,
      Layout
    }
  }
</script>
<style scoped lang="less">
</style>
