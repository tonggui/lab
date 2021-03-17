<template>
  <div class="tag-with-table-container">
    <div class="tag-with-table-search">
      <ProductSearch ref="product-search" @change="handleSearching" />
      <a @click="handleSearchOut">退出搜索</a>
    </div>
    <div class="tag-with-table">
      <TagWithList v-show="!searching" />
      <DataList
        :searching="searching"
        :selectedIdList="selectedIdList"
        @on-select-product="handleSelect"
        @on-deselect-product="handleDeSelect"
      />
    </div>
  </div>
</template>

<script>
  import TagWithList from './tag-with-list'
  import DataList from './data-list'
  import { helper } from '../../store'
  import ProductSearch from '../../components/product-search'
  const { mapState, mapActions } = helper()

  export default {
    name: 'tag-with-data-table',
    components: {
      TagWithList,
      DataList,
      ProductSearch
    },
    data () {
      return {
        searching: false
      }
    },
    computed: {
      ...mapState({
        classifySelectedProducts: 'classifySelectedProducts',
        tagListError: state => state.recommendList.tagList.error,
        productListError: state => state.recommendList.productList.error
      }),
      selectedIdList () {
        return Object.values(this.classifySelectedProducts).reduce((prev, { productList }) => {
          productList.forEach(({ id }) => prev.push(id))
          return prev
        }, [])
      }
    },
    methods: {
      ...mapActions({
        handleDestroyStatus: 'destroyStatus',
        handleSelect: 'selectProduct',
        handleDeSelect: 'deSelectProduct',
        handleGetData: 'recommendList/getData'
      }),
      handleSearching (val) {
        console.log('val', typeof val)
        this.searching = !!val
      },
      handleSearchOut () {
        this.$refs['product-search'].handleClear()
      }
    },
    mounted () {
      this.handleGetData()
    }
  }
</script>

<style lang="less" scoped>
  .tag-with-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tag-with-table-search {
      height: 46px;
      background: #F5F6FA;
      display: flex;
      align-items: center;
      padding-left: 16px;
      border: 1px solid #EEEEEE;
      border-bottom: none;
    }
    .tag-with-table {
      display: flex;
      height: calc(100% - 46px);
      border-left: 1px solid #EEE;
    }
  }
</style>
