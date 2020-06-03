<template>
  <div>
    <ListHeader :disabled="disabled" />
    <!-- <keep-alive> -->
      <!-- <transition name="list-page-transition"> -->
      <SortProductList :disabled="disabled" v-if="sorting" @close-sort="setSorting(false)" />
      <ManageProductList :disabled="disabled" v-else @open-sort="setSorting(true)" :is-business-client="isBusinessClient" />
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
  import { POI_AUDIT_STATUS } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import { STATUS as AUDIT_STATUS } from '@/data/enums/poi'

  const { mapGetters, mapActions } = createNamespacedHelpers('productList')

  export default {
    name: 'product-list-page',
    inject: ['appState'],
    computed: {
      ...mapGetters(['sorting']),
      ...mapModule({
        auditStatus: POI_AUDIT_STATUS
      }),
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      disabled () {
        return this.auditStatus === AUDIT_STATUS.AUDITING
      }
    },
    components: {
      ListHeader,
      ManageProductList,
      SortProductList,
      AgreementModal
    },
    methods: {
      ...mapActions(['getData', 'setSorting', 'destroy'])
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
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
