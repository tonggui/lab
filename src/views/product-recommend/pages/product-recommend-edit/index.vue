<template>
  <div class="product-recommend-edit">
    <div class="product-recommend-edit-nav">
      <div @click="handleGoBack">
        <Icon style="margin-top: -3px;" size="20" type="keyboard-arrow-left" />返回选择商品
      </div>
    </div>
    <ProductList :group-data="groupData" @delete="handleDelete" class="product-recommend-edit-list" />
  </div>
</template>
<script>
  import ProductList from './container/product-list'
  import { helper } from '../../store'

  const { mapState, mapActions } = helper()

  export default {
    name: 'product-recommend-edit-page',
    components: {
      ProductList
    },
    computed: {
      ...mapState({
        classifySelectedProducts: 'classifySelectedProducts'
      }),
      groupData () {
        const list = []
        const sortedList = Object.entries(this.classifySelectedProducts).sort(([key, value], [nextKey, nextValue]) => {
          return value.sequence - nextValue.sequence
        })
        sortedList.forEach(([key, value]) => {
          const { productList } = value
          if (productList.length > 0) {
            // 标品在前面，非标品在后
            list.push(({
              id: key,
              ...value,
              list: productList.sort((prev, next) => {
                if (prev.isSp === next.isSp) {
                  return 0
                }
                return prev.isSp ? -1 : 1
              })
            }))
          }
        })
        return list
      }
    },
    methods: {
      ...mapActions({
        handleDelete: 'deSelectProduct'
      }),
      handleGoBack () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less" scoped>
  .product-recommend-edit {
    height: 100%;
    display: flex;
    flex-direction: column;
    &-nav {
      margin-bottom: 16px;
      display: flex;
    }
    &-list {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
