<template>
  <div class="merchant-cube-edit">
    <ProductList
      :tag-group-product="tagGroupProduct"
      :auto-fill-tag="false"
      @delete="handleDelete"
      class="merchant-cube-edit-list"
    />
  </div>
</template>
<script>
  import ProductList from './container/product-list'
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
        handleDelete: 'deleteSelectProduct'
      }),
      handleGoBack () {
        this.$router.back()
      },
      handleExistToast () {
        console.log('wqwqwqwqwq', this.tagGroupProduct)
        const hasHqExist = Object.values(this.tagGroupProduct || {}).some(item => (item.productList || []).some(pro => !!pro.isHqExist))
        if (hasHqExist) {
          this.$Modal.info({
            title: '温馨提示',
            content: '选中商品若为总部已存在，直接基于现有商品信息进行编辑完善'
          })
        }
      }
    },
    mounted () {
      this.createTime = +new Date()
      this.handleExistToast()
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
