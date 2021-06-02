<template>
  <div class="product-recommend-edit-list">
    <div class="product-recommend-edit-list-title">
      完善商品信息
      <small>本次已创建<span class="product-recommend-edit-list-title-num">{{ createdProductCount }}</span>个商品，剩余<span class="product-recommend-edit-list-title-num">{{ remainingProductCount }}</span>个待创建</small>
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
        v-else
        class="product-recommend-edit-list-table"
        :cache-product-default-value="cacheProductDefaultValue"
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
        createdProductIdList: 'createdProductIdList',
        createdProductCount: 'createdProductCount',
        cacheProduct: 'editProductCache',
        cacheProductDefaultValue: 'editProductDefaultValueCache',
        productInfoMap: 'editProductInfoMap'
      }),
      // 展示在页面中的都是待创建的商品
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
        resetCreatedProductIdList: 'resetCreatedProductIdList',
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
      },
      leaveReport () {
        try {
          lx.mv({
            cid: 'c_shangou_online_e_yeqv8a20',
            bid: 'b_shangou_online_e_hn5n5kq9_mv',
            val: {
              viewtime: (+new Date() - this.createTime) / 1000,
              spu_num: this.createdProductCount,
              list: this.createdProductIdList,
              source_id: 0,
              page_source: window.page_source || ''
            }
          }, 'productCube')
        } catch (err) {
          console.log(err)
        }
      }
    },
    mounted () {
      this.createTime = +new Date()
      lx.mv({ bid: 'b_shangou_online_e_9jwrm32g_mv', val: { spu_num: this.remainingProductCount } }, 'productCube')
      window.addEventListener('beforeunload', () => {
        this.leaveReport()
      })
    },
    beforeDestroy () {
      this.leaveReport()
      this.resetCreatedProductCount()
      this.resetCreatedProductIdList()
      this.destroy()
    }
  }
</script>
<style lang="less">
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
      flex-shrink: 0;
      &-num {
        margin-left: 4px;
        margin-right: 4px;
      }
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
    &-table {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .quick-edit-product-table-container {
        flex: 1;
      }
    }
  }
</style>
