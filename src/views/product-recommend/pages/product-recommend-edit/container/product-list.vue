<template>
  <div class="product-recommend-edit-list">
    <div class="product-recommend-edit-list-title">
      完善商品信息
      <small>本次已创建{{ createdProductCount }}个商品，剩余{{ remainingProductCount }}个待创建</small>
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
        :group-list="groupList"
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
  import { getUniqueId } from '../../../utils'
  import lx from '@/common/lx/lxReport'

  const { mapState, mapActions } = helper('recommendEdit')

  export default {
    name: 'product-recommend-edit-list-container',
    props: {
      tagGroupProduct: {
        type: Object,
        required: true
      }
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
        return Object.values(this.tagGroupProduct).reduce((prev, { productList }) => {
          return prev + productList.length
        }, 0)
      },
      groupList () {
        const list = []
        const sortedList = Object.entries(this.tagGroupProduct).sort(([key, value], [nextKey, nextValue]) => {
          return value.sequence - nextValue.sequence
        })
        sortedList.forEach(([key, value]) => {
          const { productList } = value
          if (productList.length > 0) {
            // 标品在前面，非标品在后
            list.push(({
              id: key,
              ...value,
              productList: productList.sort((prev, next) => {
                if (prev.isSp === next.isSp) {
                  return 0
                }
                return prev.isSp ? -1 : 1
              }).map((product) => {
                const id = getUniqueId(product)
                return this.productInfoMap[id] || product
              })
            }))
          }
        })
        return list
      },
      empty () {
        return !this.groupList || this.groupList.length <= 0
      }
    },
    methods: {
      ...mapActions({
        handleModifyProduct: 'modifyProduct',
        handleModifySku: 'modifySku',
        resetCreatedProductCount: 'resetCreatedProductCount',
        handleSingleCreate: 'singleCreate',
        handleBatchCreate: 'batchCreate',
        destroy: 'destroy'
      }),
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
    mounted () {
      lx.mv({ bid: 'b_shangou_online_e_9jwrm32g_mv', val: { spu_num: this.remainingProductCount } }, 'productCube')
    },
    beforeDestroy () {
      this.resetCreatedProductCount()
      this.destroy()
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
