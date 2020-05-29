<template>
  <div class="product-recommend-edit-list-container">
    <div class="product-recommend-edit-list-title">
      完善商品信息
      <small>本次已创建{{ createdProductCount }}个商品，剩余{{ remainingProductCount }}待创建</small>
    </div>
    <ProductList :groupData="groupData" @delete="handleDelete" @modify-product="handleModifyProduct" @modify-sku="handleModifySku" />
  </div>
</template>
<script>
  import ProductList from '../components/product-list'
  import { helper } from '../../../store'

  const { mapState, mapActions, mapGetters } = helper('recommendEdit')

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
        createdProductCount: 'createdProductCount'
      }),
      ...mapGetters({
        productInfoMap: 'productInfoMap'
      }),
      remainingProductCount () {
        const total = Object.values(this.groupData).reduce((prev, { productList }) => {
          return prev + productList.length
        }, 0)
        return total - this.createdProductCount
      }
    },
    methods: {
      ...mapActions({
        handleModifyProduct: 'modifyProduct',
        handleModifySku: 'modifySku',
        resetCreatedProductCount: 'resetCreatedProductCount'
      }),
      handleDelete (productList) {
        this.$emit('delete', productList)
      }
    },
    beforeDestroy () {
      this.resetCreatedProductCount()
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit-list-container {
    flex: 1;
    overflow: hidden;
    background: @component-bg;
    display: flex;
    flex-direction: column;
    .product-recommend-edit-list-title {
      padding: 24px;
      font-size: 18px;
      color: #36394D;
      font-weight: 600;
      small {
        display: inline-block;
        font-size: @font-size-base;
        padding-left: 8px;
        margin-left: 24px;
        border-left: 1px solid #D8D8D8;
        line-height: 14px;
      }
    }
  }
</style>
