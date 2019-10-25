<template>
  <ErrorBoundary :error="error" @refresh="getData" description="搜索哪里出了问题～">
    <ProductListPage>
      <div slot="header">
        <div @click="handleBack"><a><Icon type="arrow-left-double" size="18" />返回上一页</a></div>
        <FilterForm :data="filterData" @submit="handleSubmit" @clear="handleClear"  />
      </div>
      <TagList slot="tag-list" @select="handleChangeTag" />
      <ProductTableList slot="product-list" :tag-list="poiTagList" />
    </ProductListPage>
  </ErrorBoundary>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import TagList from './container/tag-list'
  import ProductTableList from './container/product-table-list'
  import FilterForm from './components/filter-form'

  const { mapActions, mapGetters, mapState } = createNamespacedHelpers('searchList')

  export default {
    name: 'search-list-conatiner',
    components: {
      ProductListPage,
      FilterForm,
      TagList,
      ProductTableList
    },
    computed: {
      ...mapState(['error', 'poiTagList']),
      ...mapGetters({
        filterData: 'filters'
      })
    },
    methods: {
      ...mapActions(['getData', 'setInitData', 'submitFilters', 'clearFilters', 'getPoiTagList', 'destroy']),
      ...mapActions({
        handleChangeTag: 'changeTag',
        handleClear: 'clearFilters'
      }),
      handleBack () {
        this.$router.go(-1)
      },
      handleSubmit (filters) {
        const { keyword } = filters
        let query = { keyword }
        // 关键词变了 清除 tagId 和 brandId
        if (keyword !== this.$route.query.keyword) {
          query = { ...query, tagId: '', brandId: '' }
        }
        this.updateQuery(query)
        this.submitFilters(filters)
      },
      updateQuery (query) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            ...query
          }
        })
      }
    },
    created () {
      /**
       * 以下字段出现在url上 用于控制商品状态
       */
      let { keyword, tagId, brandId, curQueryType } = this.$route.query
      keyword = keyword || ''
      tagId = tagId && Number(tagId)
      brandId = brandId && Number(brandId)
      this.setInitData({ keyword, tagId, brandId, status: curQueryType })
    },
    mounted () {
      this.getData()
      this.getPoiTagList()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
