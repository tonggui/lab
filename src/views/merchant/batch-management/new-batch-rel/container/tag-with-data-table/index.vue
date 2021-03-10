<template>
  <div class="tag-with-data-container">
    <TagWithList />
    <DataList
      :selectedIdList="selectedIdList"
      @on-select-product="handleSelect"
      @on-deselect-product="handleDeSelect"
    />
  </div>
</template>

<script>
  import TagWithList from './tag-with-list'
  import DataList from './data-list'
  import { helper } from '../../store'
  const { mapState, mapActions } = helper()

  export default {
    name: 'tag-with-data-table',
    components: {
      TagWithList,
      DataList
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
      })
    },
    mounted () {
      this.handleGetData()
    }
  }
</script>

<style lang="less" scoped>
  .tag-with-data-container {
    display: flex;
    height: 100%;
  }
</style>
