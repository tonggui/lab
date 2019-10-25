<template>
  <div>
    <ListHeader />
    <!-- <keep-alive> -->
      <!-- <transition name="list-page-transition"> -->
      <SortProductList v-if="sorting" @close-sort="setSorting(false)" />
      <ManageProductList v-else @open-sort="setSorting(true)" :is-business-client="isBusinessClient" />
      <!-- </transition> -->
    <!-- </keep-alive> -->
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
    inject: ['appState'],
    computed: {
      ...mapGetters(['sorting']),
      isBusinessClient () {
        return this.appState.isBusinessClient
      }
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
    &-enter-active {
      transition: all .3s ease;
    }
    &-leave-active {
      transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    &-enter, &-leave-to {
      transform: translateX(100%);
      opacity: 0.4;
    }
    &-leave-to {
      transform: translateX(10px);
      opacity: 0.4;
    }
  }
</style>
