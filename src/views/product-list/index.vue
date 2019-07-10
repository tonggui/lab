<template>
  <Layout>
    <ListHeader slot="header" class="header" />
    <TagList
      slot="tag-list"
      :sorting="sorting"
      :tagId="tagId"
      @select="handleTagIdChange"
      @open-sort="handleStartSort"
    />
    <ProductListTable slot="product-list" :sorting="sorting" :tagId="tagId" />
    <ListFooter slot="footer" class="footer" />
  </Layout>
</template>

<script>
import {
  defaultTagId
} from '@/data/constants/poi'
import ListHeader from './components/list-header'
import ListFooter from './components/list-footer'
import TagList from './components/tag-list'
import ProductListTable from './components/product-table-list'
import Layout from '@/views/components/product-list/layout/page'

export default {
  name: 'product-list',
  data () {
    return {
      sorting: false, // 排序模式中
      tagId: defaultTagId // 当前的tagId
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
.footer {
  margin-top: 10px;
}
</style>
