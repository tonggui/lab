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
      <ProductTableList :sorting="sorting" :tagId="tagId"></ProductTableList>
    </div>
  </div>
</template>
<script>
import { defaultTagId } from '@/data/constants/poi'
import TagList from './components/tag-list'
import ProductTableList from './components/product-table-list'

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
    ProductTableList
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
    border-right: 1px solid @border-color-base;
  }
  .product-list {
    flex: 1;
    min-width: 600px;
  }
</style>
