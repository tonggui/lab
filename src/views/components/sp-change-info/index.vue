<template>
  <Modal
    title="字段更新提示"
    :value="value"
    @input="handleVisibleChange"
    width="600"
  >
    <SpChangeInfo
      :price="primarySku.price.value"
      :weight-unit="primarySku.weight.unit"
      :changes="changes"
    />
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
      <Button type="primary" @click="handleConfirm(2)">同意但不替换图片</Button>
    </div>
  </Modal>
</template>

<script>
  import SpChangeInfo from './sp-change-list'

  export default {
    name: 'SpChangeInfoModal',
    components: {
      SpChangeInfo
    },
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
        if (v && v.length) {
          this.value = true
        }
      }
    },
    methods: {
      handleConfirm (type = 3) {
        this.$emit('confirm', type)
        this.value = false
      },
      handleVisibleChange (v = false) {
        if (!v) {
          this.handleConfirm(3)
        }
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
