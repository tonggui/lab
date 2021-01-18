<template>
  <ProductListPage>
    <SortTagList slot="tag-list" @before-select="handleBeforeChangeTag" />
    <SortProductList slot="product-list" />
    <SortListFooter slot="footer" @back="$emit('close-sort')" />
  </ProductListPage>
</template>
<script>
  import ProductListPage from '@/views/components/layout/product-list-page'
  import SortTagList from './sort-tag-list'
  import SortProductList from './sort-product-list'
  import SortListFooter from './sort-list-footer'
  import { helper } from '../../store'

  const { mapState } = helper()

  export default {
    name: 'merchant-product-sort-list-container',
    components: {
      ProductListPage,
      SortTagList,
      SortProductList,
      SortListFooter
    },
    computed: {
      ...mapState(['productSorted'])
    },
    methods: {
      handleBeforeChangeTag (cb) {
        if (this.productSorted) {
          this.$Modal.confirm({
            title: '提示',
            content: '您修改的商品排序尚未同步给门店，是否放弃同步？',
            okText: '去同步',
            cancelText: '放弃',
            onCancel: cb
          })
        } else {
          cb()
        }
      }
    }
  }
</script>
