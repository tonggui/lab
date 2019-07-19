<template>
  <Modal
    title="字段更新提示"
    v-model="value"
    width="600"
  >
    <SpChangeInfo
      :price="primarySku.price"
      :weight-unit="primarySku.weight && primarySku.weight.unit"
      :changes="changes"
    />
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <Button @click="handleVisibleChange(false)">暂不替换</Button>
      <Button type="primary" @click="handleConfirm">同意替换</Button>
      <Button type="primary" @click="handleConfirm(false)">同意但不替换图片</Button>
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
      visible: Boolean,
      changes: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        value: this.visible
      }
    },
    computed: {
      primarySku () {
        if (this.product && this.product.skuList) {
          return this.product.skuList[0]
        }
        return {}
      }
    },
    watch: {
      visible (v) {
        this.value = v
      }
    },
    methods: {
      handleConfirm (replacePicture = true) {
        this.$emit('on-confirm', replacePicture)
        this.handleVisibleChange(false)
      },
      handleVisibleChange (v = false) {
        this.value = !!v
        this.$emit('on-visible-change', this.value)
      }
    }
  }
</script>

<style scoped lang="less">
  .sp-change-footer {
    .boo-btn {
      margin-left: 16px;
    }
  }
</style>
