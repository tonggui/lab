<template>
  <Modal
    title="字段更新提示"
    :value="value"
    @on-cancel="handleCancel"
    width="700"
  >
    <SpChangeInfo
      :price="product.price"
      :changes="basicChanges"
      warningText="如价格与商品不对应，请替换商品后立即修改价格"
    />
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <Button @click="handleCancel">暂不替换</Button>
      <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
    </div>
  </Modal>
</template>

<script>
  import SpChangeInfo from './sp-change-list'

  export default {
    name: 'SpChangeInfoModal',
    components: { SpChangeInfo },
    props: {
      product: Object,
      changeInfo: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        confirmed: false
      }
    },
    computed: {
      basicChanges () {
        return this.changeInfo.basicInfoList || []
      },
      categoryAttrChanges () {
        return this.changeInfo.categoryAttrInfoList || []
      },
      value () {
        return !!(this.basicChanges.length || this.categoryAttrChanges.length) && !this.confirmed
      }
    },
    methods: {
      handleConfirm (type = 3) {
        this.$emit('confirm', type)
        this.confirmed = true
      },
      handleCancel () {
        this.handleConfirm(3)
      }
    }
  }
</script>

<style scoped lang="less">
  .sp-change-footer {
    .boo-btn {
      margin-left: 10px;
    }
  }
</style>
