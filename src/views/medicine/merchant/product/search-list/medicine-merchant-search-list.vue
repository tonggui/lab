<template>
  <ProductListPage>
    <div slot="header">
      <div @click="handleBack"><a><Icon type="arrow-left-double" size="18" />返回上一页</a></div>
      <FilterForm @submit="handleFilter"  />
    </div>
    <TagList slot="tag-list" />
    <ProductList slot="product-list" />
  </ProductListPage>
</template>
<script>
  // import { isEqual } from 'lodash'
  import { helper } from './store'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import TagList from './container/tag-list'
  import ProductList from './container/product-list'
  import FilterForm from './components/filter-form'

  const { mapActions } = helper()

  export default {
    name: 'medicine-merchant-search-list-page',
    components: {
      ProductListPage,
      TagList,
      ProductList,
      FilterForm
    },
    computed: {
      keyword () {
        const query = this.$route.query || {}
        return query.keyword || ''
      }
    },
    methods: {
      ...mapActions({
        getData: 'getData',
        destroy: 'destroy',
        changeFilters: 'changeFilters',
        initFilters: 'initFilters'
      }),
      getQueryData () {
        const query = this.$route.query || {}
        const tagId = query.tagId ? Number(query.tagId) : ''
        const keyword = query.keyword || ''
        const brandId = query.brandId || ''
        return {
          tagId,
          keyword,
          brandId
        }
      },
      // updateQuery (query) {
      //   const newQuery = { ...this.$route.query, ...query }
      //   if (!isEqual(newQuery, this.$route.query)) {
      //     this.$router.replace({
      //       query: newQuery
      //     })
      //   }
      // },
      // handleSearch ({ name, tagId, brandId }) {
      //   // 修改 搜索 query
      //   const query = {
      //     keyword: name || '',
      //     tagId: tagId || '',
      //     brandId: brandId || ''
      //   }
      //   this.updateQuery(query)
      //   return this.changeFilters(query)
      // },
      handleBack () {
        this.$router.go(-1)
      },
      handleFilter (data) {
        // 重新筛选 把上页带过来的信息清除
        const query = {
          ...data,
          keyword: '',
          tagId: '',
          brandId: ''
        }
        this.changeFilters(query)
      }
    },
    created () {
      const { tagId, keyword, brandId } = this.getQueryData()
      this.initFilters({ tagId, keyword, brandId })
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
