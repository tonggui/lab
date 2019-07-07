<template>
  <div class="container">
    <div class="tag-list">
      <TagList
        :sorting="sorting"
        :tagId="tagId"
        fixed
        @change="handleTagIdChange"
        @sort="handleStartSort"
      >
      </TagList>
    </div>
    <div class="product-list">
      <ProductListTable :sorting="sorting" :tagId="tagId"></ProductListTable>
    </div>
  </div>
</template>
<script>
import { defaultTagId } from '@/data/constants/poi'
import TagList from './components/tag-list'
import ProductListTable from './components/product-table-list'

export default {
  name: 'product-list-content',
  data () {
    return {
      sorting: false, // 排序模式中
      tagId: defaultTagId // 当前的tagId
    }
  },
  components: {
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
  .container {
    height: 100%;
    display: flex;
  }
  .tag-list {
    width: 220px;
  }
  .product-list {
    flex: 1;
    min-width: 600px;
  }
</style>
