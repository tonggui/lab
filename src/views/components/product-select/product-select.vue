<template>
  <div class="product-select-container">
    <div class="product-select-tag-list-container">
      <TagTree
        :value="selectedTagId"
        :dataSource="tagList"
        @select="handleTagSelected"
        showAllData
        :productCount="0"
      >
        <template slot="empty">
          <Empty description="暂无分类" v-if="!loading" />
        </template>
      </TagTree>
    </div>
    <div class="product-select-product-list-container">
      <ProductTableList
        :maxSelect="maxCount"
        :loading="loading"
        :pagination="pagination"
        :dataSource="productList"
        :selectedIdList="selectedProductIdList"
        @on-page-change="handlePageChange"
        @on-select="handleSelect"
        @on-de-select="handleDeSelect"
      />
    </div>
  </div>
</template>

<script>
  import TagTree from '@/components/tag-tree'
  import ProductTableList from '@/views/product-recommend/pages/product-recommend-list/components/product-table-list'
  export default {
    name: 'ProductSelect',
    components: {
      TagTree,
      ProductTableList
    },
    props: {
      maxCount: {
        type: Number,
        default: () => Number.MAX_VALUE
      }
    },
    data () {
      return {
        selectedTagId: 0,
        tagList: [],
        productList: [],
        selectedProductIdList: []
      }
    },
    methods: {
      handleTagSelected () {},
      handleProductSelectChanged (changedProductList, type = 'select') {}
    }
  }
</script>

<style scoped lang="less">
  .product-select-container {
    display: flex;
    height: 100%;
  }

  .product-select-product-list-container {
    flex: 1;
  }
</style>
