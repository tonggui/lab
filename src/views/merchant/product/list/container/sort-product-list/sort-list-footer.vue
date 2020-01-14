<template>
  <StickyFooter class="footer" :gap="0">
    <AsyncConfirm class="footer-item" @submit="asyncProductList" :async-type="ASYNC_TYPE.PRODUCT" :current-tag="currentTag" v-mc="{ bid: 'b_shangou_online_e_39j4jbvy_mc', val: { op_type: 2 } }">
      <Button type="primary">同步商品排序</Button>
    </AsyncConfirm>
    <AsyncConfirm class="footer-item" @submit="asyncTagList" :async-type="ASYNC_TYPE.TAG" :current-tag="currentTag" v-mc="{ bid: 'b_shangou_online_e_39j4jbvy_mc', val: { op_type: 1 } }">
      <Button type="primary">同步分类排序</Button>
    </AsyncConfirm>
    <Button class="footer-item" @click="handleBack" v-mc="{ bid: 'b_shangou_online_e_39j4jbvy_mc', val: { op_type: 0 } }">返回</Button>
  </StickyFooter>
</template>
<script>
  import StickyFooter from '@components/sticky-footer'
  import AsyncConfirm, { ASYNC_TYPE } from '../../components/async-confirm'
  import { helper } from '../../store'

  const { mapState, mapActions, mapGetters } = helper()

  export default {
    name: 'merchant-product-sort-list-footer',
    components: {
      StickyFooter,
      AsyncConfirm
    },
    data () {
      return { ASYNC_TYPE }
    },
    computed: {
      ...mapState(['tagSorted', 'productSorted']),
      ...mapGetters(['currentTag'])
    },
    methods: {
      ...mapActions(['asyncTagList', 'asyncProductList']),
      handleBack () {
        const back = () => this.$emit('back')
        const sorted = this.productSorted || this.tagSorted
        if (sorted) {
          this.$Modal.confirm({
            title: '提示',
            content: '您修改的排序操作尚未同步给门店，是否放弃同步？',
            okText: '去同步',
            cancelText: '放弃',
            onCancel: back
          })
        } else {
          back()
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .footer {
    z-index: 10;
    &-item {
      margin-left: 5px;
    }
  }
</style>
