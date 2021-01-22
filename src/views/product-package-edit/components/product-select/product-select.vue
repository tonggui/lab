<template>
  <div class="product-select-container">
    <div class="product-select-tag-list-container">
      <TagTree
        :value="selectedTagId"
        :dataSource="tagList"
        @select="handleTagSelected"
        showAllData
        :loading="loading"
        :productCount="totalProductCount"
        class="tag-tree-custom"
      >
        <template slot="empty">
          <Loading v-if="loading" />
          <Empty description="暂无分类" v-else />
        </template>
      </TagTree>
    </div>
    <div class="product-select-product-list-container">
      <ProductTableList
        :maxSelect="maxCount"
        :loading="loading"
        :pagination="pagination"
        :dataSource="tableSource"
        :selectedList="selectedList"
        :selectableTester="selectableTester"
        @on-page-change="handlePageChange"
        @on-select="handleSelect"
        @on-de-select="handleDeSelect"
      >
        <slot name="header-right" slot="header-right" />
        <template v-slot:item="{ product }">
          <ProductInfo :product="product" @on-select="handleSpecSelect"/>
        </template>
      </ProductTableList>
    </div>
  </div>
</template>

<script>
  import TagTree from '@/components/tag-tree'
  import ProductInfo from './product-info'
  import ProductTableList from '../product-table-list'

  export default {
    name: 'ProductSelect',
    components: {
      TagTree,
      ProductTableList,
      ProductInfo
    },
    props: {
      tagList: {
        type: Array,
        default: () => []
      },
      totalProductCount: {
        type: Number,
        default: () => 0
      },
      selectedTagId: {
        type: Number,
        default: 0
      },
      selectedList: {
        type: Array,
        default: () => []
      },
      maxCount: {
        type: Number,
        default: 100
      },
      loading: {
        type: Boolean,
        default: false
      },
      pagination: {
        type: Object,
        default: () => ({
          current: 1,
          pageSize: 20,
          total: 0
        })
      },
      tableSource: {
        type: Array,
        default: () => []
      },
      keyword: String,
      selectableTester: Function
    },
    data () {
      return {
        specSelectedInfoList: []
      }
    },
    methods: {
      handleTagSelected (tagId) {
        this.$emit('on-tag-change', tagId)
      },
      handleProductSelectChanged (changedProductList, type = 'select') {},
      handleSearch (keyword) {
        this.$emit('on-search-change', keyword)
      },
      handlePageChange (pagination) {
        this.$emit('on-page-change', pagination)
      },
      handleSelect (items) {
        this.$emit('on-select', items)
      },
      handleDeSelect (deSelectItem) {
        this.$emit('on-de-select', deSelectItem)
      },
      handleSpecSelect (specInfo) {
        if (this.specSelectedInfoList.some(item => item.id === specInfo.id)) {
          this.specSelectedInfoList.forEach(item => {
            if (item.id === specInfo.id) item.skuSelectedId = specInfo.skuSelectedId
          })
        } else {
          this.specSelectedInfoList.push(specInfo)
        }
        this.$emit('on-sku-select', this.specSelectedInfoList)
      }
    }
  }
</script>

<style scoped lang="less">
  .product-select-container {
    display: flex;
    width: 100%;
    height: 600px;
  }
  .product-select-tag-list-container {
    border-right: 1px solid #E9EAF2;
    width: 220px;
    height: 100%;
    overflow: auto;
  }
  .product-select-product-list-container {
    flex: 1;
    height: 100%;
  }
</style>
