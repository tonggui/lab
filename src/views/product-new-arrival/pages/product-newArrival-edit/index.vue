<template>
  <div class="product-recommend-edit">
    <div class="product-recommend-edit-nav">
      <div @click="handleGoBack">
        <Icon style="margin-top: -3px;" size="20" type="keyboard-arrow-left" />返回选择商品
      </div>
    </div>
    <ProductList :tag-group-product="tagGroupProduct" @delete="handleDelete" class="product-recommend-edit-list" />
  </div>
</template>
<script>
  import { fetchGetIsAutoFillRecProductTag } from '@/data/repos/category'
  import ProductList from './container/product-list'
  import { helper } from '../../store'
  import { getCategoryIdList } from '../../utils'
  import LocalStorage, { KEYS } from '@/common/local-storage'

  const { mapState, mapActions } = helper()

  export default {
    name: 'product-recommend-edit-page',
    components: {
      ProductList
    },
    computed: {
      ...mapState({
        tagGroupProduct: 'classifySelectedProducts'
      })
    },
    methods: {
      ...mapActions({
        handleDelete: 'deSelectProduct'
      }),
      handleGoBack () {
        this.$router.back()
      },
      async getIsAutoFill () {
        const hasAutoFill = await fetchGetIsAutoFillRecProductTag({ categoryIds: getCategoryIdList(this.tagGroupProduct) })
        const autoFill = LocalStorage[KEYS.PRODUCT_NEW_ARRIVAL_AUTO_FILL]
        if (hasAutoFill && !autoFill) {
          this.$Modal.info({
            title: '温馨提示',
            content: '平台已自动帮您填写部分新商品的店内分类，无需再手动填写',
            centerLayout: true,
            iconType: '',
            width: 420,
            okText: '我知道了',
            onOk: () => {
              LocalStorage[KEYS.PRODUCT_NEW_ARRIVAL_AUTO_FILL] = true
            }
          })
        }
      }
    },
    mounted () {
      this.getIsAutoFill()
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
      flex-shrink: 0;
    }
    &-list {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
