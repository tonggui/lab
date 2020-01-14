<template>
  <div>
    <BreadcrumbHeader>搜索列表</BreadcrumbHeader>
    <ProductListPage>
      <div class="header" slot="header">
        <h4>搜索列表</h4>
        <div>
          <ProductSearch :default-value="keyword" @search="handleSearch" />
        </div>
      </div>
      <TagList slot="tag-list" />
      <ProductList slot="product-list" />
    </ProductListPage>
  </div>
</template>
<script>
  import { isEqual } from 'lodash'
  import { helper } from './store'
  import BreadcrumbHeader from '@/views/merchant/components/breadcrumb-header'
  import ProductListPage from '@/views/components/layout/product-list-page'
  import ProductSearch from '@/views/merchant/components/product-search'
  import TagList from './container/tag-list'
  import ProductList from './container/product-list'

  const { mapActions } = helper()

  export default {
    name: 'merchant-search-list-page',
    components: {
      BreadcrumbHeader,
      ProductListPage,
      ProductSearch,
      TagList,
      ProductList
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
      updateQuery (query) {
        const newQuery = { ...this.$route.query, ...query }
        if (!isEqual(newQuery, this.$route.query)) {
          this.$router.replace({
            query: newQuery
          })
        }
      },
      handleSearch ({ name, tagId, brandId }) {
        // 修改 搜索 query
        const query = {
          keyword: name || '',
          tagId: tagId || '',
          brandId: brandId || ''
        }
        this.updateQuery(query)
        return this.changeFilters(query)
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
<style lang="less" scoped>
.header {
  height: 60px;
  line-height: 60px;
  background: #FFF;
  border-bottom: 1px solid @border-color-base;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
