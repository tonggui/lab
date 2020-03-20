<template>
  <div :class="['false-price-product-update', { 'disabled': disabled || submitting }]">
    <Tooltip :disabled="!updateToSuggestedPriceTip" :content="updateToSuggestedPriceTip" placement="top" :width="230">
      <span @click="updateToSuggestedPrice">改为建议价</span>
    </Tooltip>
  </div>
</template>

<script>
  import { fetchSubmitFlasePriceToSuggestedPrice } from '@/data/repos/product'

  export default {
    name: 'false-price-product-update',
    props: {
      index: {
        type: [Number, String],
        required: true
      },
      rowData: {
        type: Object,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      timeAllowModify: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        submitting: false // 将价格改为建议价 提交ing
      }
    },
    computed: {
      updateToSuggestedPriceTip () {
        const { mondayBeginTime = '', fridayEndTime = '' } = this.timeAllowModify
        let text = `提示:目前只能在周一${this.timeAllowModify.mondayBeginTime}到周五${this.timeAllowModify.fridayEndTime}点此段时间内修改`
        if (!mondayBeginTime && !fridayEndTime) {
          text = ''
        }
        return text
      }
    },
    methods: {
      updateToSuggestedPrice () {
        // 若不允许修改该价格，则return
        if (this.disabled) return
        let confirmText = `是否确认将："${this.rowData.sku_name}"的价格修改为${this.rowData.suggest_price}元`
        if (this.rowData.spec) {
          confirmText = `是否确认将："${this.rowData.sku_name}"-【${this.rowData.spec}】的价格修改为${this.rowData.suggest_price}元`
        }
        let self = this
        this.$Modal.confirm({
          icon: 'warning',
          content: confirmText,
          onOk: () => {
            self.submitModify()
          }
        })
      },
      async submitModify () {
        this.submitting = true
        try {
          await fetchSubmitFlasePriceToSuggestedPrice(this.rowData.sku_id)
          this.$Message.success('修改成功')
          this.$emit('falsePriceUpdated', this.index)
        } catch (err) {
          this.$Message.error(err.message)
        } finally {
          this.submitting = false
        }
      }
    }
  }
</script>

<style lang='less' scoped>
.false-price-product-update {
  color: @highlight-color;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
  }
}
</style>
