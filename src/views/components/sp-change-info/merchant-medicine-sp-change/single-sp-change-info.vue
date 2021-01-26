<template>
  <Modal
    title="字段更新提示"
    :value="value"
    :footerHide="onlyCheck"
    @on-cancel="handleCancel"
    width="700"
  >
    <div class="sp-change-content">
      <SpChangeInfo
        v-if="basicChanges.length"
        :price="product.price"
        warningText="如价格与商品不对应，请替换商品后立即修改价格"
        :changes="basicChanges"
      />
      <SpChangeInfo
        v-if="categoryAttrChanges.length"
        title="其他信息"
        :changes="categoryAttrChanges"
      />
    </div>
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
  import SpChangeInfo from '@/views/components/configurable-form/components/sp-change-info/components/sp-change-list'

  export default {
    name: 'MedicineSingleSpChangeInfoModal',
    components: { SpChangeInfo },
    props: {
      product: Object,
      changeInfo: {
        type: Object,
        default: () => ({})
      },
      onlyCheck: {
        type: Boolean,
        default: false
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {
      basicChanges () {
        return this.changeInfo.basicInfoList || []
      },
      categoryAttrChanges () {
        return this.changeInfo.categoryAttrInfoList || []
      }
    },
    methods: {
      handleConfirm (type = 3) {
        this.$emit('confirm', this.product)
      },
      handleCancel () {
        this.$emit('change', false)
      }
    }
  }
</script>

<style scoped lang="less">
  .sp-change-content {
    max-height: 600px;
    overflow: auto;
  }
  .sp-change-footer {
    .boo-btn {
      margin-left: 10px;
    }
  }
  .title {
    margin: 6px 0;
    font-weight: normal;
    font-size: @font-size-base;
    color: @text-color;
  }
  .diffs {
    background: #F7F8FA;
    padding: 10px;
  }
</style>
