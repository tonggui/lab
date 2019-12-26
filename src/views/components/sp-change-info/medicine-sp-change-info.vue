<template>
  <Modal
    title="字段更新提示"
    :value="value"
    @on-cancel="handleCancel"
    width="600"
  >
    <SpChangeInfo
      :price="primarySku.price.value"
      :weight-unit="primarySku.weight.unit"
      :changes="changes"
      warningText="如价格与商品不对应，请替换商品后立即修改价格"
    />
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <Button type="primary" @click="handleCancel">暂不替换</Button>
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
      changes: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        value: false
      }
    },
    computed: {
      primarySku () {
        if (this.product && this.product.skuList && this.product.skuList.length) {
          return this.product.skuList[0]
        }
        return {
          price: { value: 0 },
          weight: { value: 0 }
        }
      }
    },
    watch: {
      changes (v) {
        if (v && v.length && !this.confirmed) {
          this.value = true
        }
      }
    },
    methods: {
      handleConfirm (type = 3) {
        this.$emit('confirm', type)
        this.value = false
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
