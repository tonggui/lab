<template>
  <div class="product-recommend-edit-list">
    <div class="product-recommend-edit-list-title">
      完善商品信息
      <small>本次已创建{{ createdProductCount }}个商品，剩余{{ remainingProductCount }}待创建</small>
    </div>
    <div class="product-recommend-edit-list-content">
      <ProductEmpty v-if="empty">
        <p slot="description">本次所选商品已全部创建</p>
        <template slot="operation">
          <Button @click="handleGoList">查看店内商品</Button>
          <Button type="primary" @click="handleGoRecommendList">继续创建</Button>
        </template>
      </ProductEmpty>
      <ProductList
        class="product-recommend-edit-table-list"
        v-else
        :cache-product="cacheProduct"
        :group-data="groupData"
        :product-info-map="productInfoMap"
        @single-create="handleSingleCreate"
        @batch-create="handleBatchCreate"
        @delete="handleDelete"
        @modify-product="handleModifyProduct"
        @modify-sku="handleModifySku"
      />
    </div>
  </div>
</template>
<script>
  import ProductList from '../components/product-list'
  import { helper } from '../../../store'

  const { mapState, mapActions } = helper('recommendEdit')

  export default {
    name: 'product-recommend-edit-list-container',
    props: {
      groupData: Array
    },
    components: {
      ProductList
    },
    computed: {
      ...mapState({
        createdProductCount: 'createdProductCount',
        cacheProduct: 'editProductCache',
        productInfoMap: 'editProductInfoMap'
      }),
      remainingProductCount () {
        const total = Object.values(this.groupData).reduce((prev, { productList }) => {
          return prev + productList.length
        }, 0)
        return total - this.createdProductCount
      },
      empty () {
        return !this.groupData || this.groupData.length <= 0
      }
    },
    methods: {
      ...mapActions({
        handleModifyProduct: 'modifyProduct',
        handleModifySku: 'modifySku',
        resetCreatedProductCount: 'resetCreatedProductCount',
        singleCreate: 'singleCreate',
        handleBatchCreate: 'batchCreate'
      }),
      async handleSingleCreate (product) {
        await this.singleCreate(product)
        this.handleDelete([product])
      },
      handleDelete (productList) {
        this.$emit('delete', productList)
      },
      handleGoList () {
        this.$router.push({
          path: '/product/list',
          query: this.$route.query
        })
      },
      handleGoRecommendList () {
        this.$router.back()
      }
    },
    beforeDestroy () {
      this.resetCreatedProductCount()
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-list {
    background: @component-bg;
    display: flex;
    flex-direction: column;
    &-title {
      padding: 24px;
      font-size: 18px;
      color: #36394D;
      font-weight: 600;
      display: flex;
      align-items: center;
      small {
        display: inline-block;
        font-size: @font-size-base;
        padding-left: 8px;
        margin-left: 24px;
        border-left: 1px solid #D8D8D8;
        line-height: 14px;
      }
    }
    &-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &-table-list {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
