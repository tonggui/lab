<template>
  <div>
    <ListHeader />
    <transition name="list-page-transition">
      <SortProductList v-if="sorting" @close-sort="setSorting(false)" />
      <ManageProductList v-else @open-sort="setSorting(true)" />
    </transition>
    <AgreementModal mode="sign" />
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ListHeader from './container/list-header'
  import ManageProductList from './container/manage-product-list'
  import SortProductList from './container/sort-product-list'
  import AgreementModal from '@components/agreement-modal'

  const { mapGetters, mapActions } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list-page',
    computed: {
      ...mapGetters(['sorting'])
    },
    components: {
      ListHeader,
      ManageProductList,
      SortProductList,
      AgreementModal
    },
    methods: {
      ...mapActions(['getData', 'setSorting'])
    },
    mounted () {
      this.getData()
    }
  }
</script>
<style lang="less">
  .list-page-transition {
    &-enter-active, &-leave-active {
      transition: transform .5s linear;
    }
    &-enter {
      transform: translateX(100%);
      opacity: 0.4;
    }
    &-leave-to {
      transform: translateX(-100%);
      opacity: 0.4;
    }
  }
</style>
