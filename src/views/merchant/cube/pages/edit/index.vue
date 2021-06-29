<template>
  <div class="merchant-cube-edit">
    <ProductList
      :tag-group-product="tagGroupProduct"
      @delete="handleDelete"
      class="merchant-cube-edit-list"
    />
  </div>
</template>
<script>
  // import { fetchGetIsAutoFillRecProductTag } from '@/data/repos/category'
  import ProductList from './container/product-list'
  // import { getCategoryIdList } from '../../utils'
  // import LocalStorage, { KEYS } from '@/common/local-storage'
  import lx from '@/common/lx/lxReport'
  import { helper } from '../../store'

  const { mapState, mapActions } = helper()

  export default {
    name: 'merchant-cube-edit-page',
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
      }
      // async getIsAutoFill () {
      //   const autoFill = LocalStorage[KEYS.PRODUCT_NEW_ARRIVAL_AUTO_FILL]
      //   if (!autoFill) {
      //     const hasAutoFill = await fetchGetIsAutoFillRecProductTag({ categoryIds: getCategoryIdList(this.tagGroupProduct) })
      //     if (hasAutoFill) {
      //       this.$Modal.info({
      //         title: '温馨提示',
      //         content: '平台已自动帮您填写部分新商品的店内分类，无需再手动填写',
      //         centerLayout: true,
      //         iconType: '',
      //         width: 420,
      //         okText: '我知道了',
      //         onOk: () => {
      //           LocalStorage[KEYS.PRODUCT_NEW_ARRIVAL_AUTO_FILL] = true
      //         }
      //       })
      //     }
      //   }
      // }
    },
    mounted () {
      this.createTime = +new Date()
      // this.getIsAutoFill()
    },
    beforeDestroy () {
      lx.mv({
        cid: 'c_shangou_online_e_m17be667',
        bid: 'b_shangou_online_e_439bseot_mv',
        val: {
          viewtime: (+new Date() - this.createTime) / 1000
        }
      }, 'productCube')
    }
  }
</script>
<style lang="less" scoped>
  .merchant-cube-edit {
    //height: 100%;
    overflow: hidden;
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
