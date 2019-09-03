<template>
  <div>
    <ProductTableList
      :tag-id="tagId"
      :status="status"
      :status-list="statusList"
      @sort-change="handleSortChange"
      @status-change="handleTabChange"
      :dataSource="list"
      :pagination="pagination"
      :loading="loading"
      @page-change="handlePageChange"
      @batch="handleBatchOp"
      @delete="handleDelete"
      @edit="handleModify"
      @edit-sku="handleModifySku"
    >
      <template slot="empty">
        <div v-if="isNewPoiRecommend">
          <div>快去新建商品吧~</div>
          <div>根据您经营的品类，为您推荐了必建商品可快速新建多个商品！</div>
          <NamedLink :name="hotRecommendPage" tag="a">
            <Button type="primary">新店必建商品</Button>
          </NamedLink>
        </div>
        <span v-else>快去新建商品吧~</span>
      </template>
    </ProductTableList>
  </div>
</template>
<script>
  import NamedLink from '@components/link/named-link'
  import hotRecommendPage from '@sgfe/eproduct/navigator/pages/product/hotRecommend'
  import ProductTableList from '../components/product-table-list'
  import { createNamespacedHelpers } from 'vuex'

  const { mapActions, mapState } = createNamespacedHelpers('productList/product')

  export default {
    name: 'product-table-list-container',
    props: {
      isNewPoiRecommend: Boolean
    },
    computed: {
      ...mapState(['loading', 'status', 'statusList', 'list', 'pagination', 'sorter', 'tagId']),
      hotRecommendPage () {
        return hotRecommendPage.name
      }
    },
    components: {
      ProductTableList,
      NamedLink
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange',
        handleTabChange: 'statusChange',
        handleSortChange: 'sortChange',
        batch: 'batch',
        handleDelete: 'delete',
        handleModify: 'modify',
        handleModifySku: 'modifySku'
      }),
      async handleBatchOp ({ type, data, idList }, cb) {
        try {
          await this.batch({ type, data, idList })
          cb && cb()
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
