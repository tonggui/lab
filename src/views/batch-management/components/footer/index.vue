<template>
  <StickFooter
    class="batch-sticky-footer"
    :btnTexts="btnTexts"
    :btnProps="btnProps"
    @on-click="handleClickEvent"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
  import StickFooter from '@/components/sticky-footer'
  export default {
    name: 'BatchFixedFooter',
    components: {
      StickFooter
    },
    props: {
      confirmText: {
        type: String,
        default: () => '确定提交'
      },
      cancelText: {
        type: String,
        default: () => '取消'
      },
      submitting: Boolean
    },
    computed: {
      btnTexts () {
        return [this.confirmText, this.cancelText]
      },
      btnProps () {
        return [{ loading: this.submitting }]
      }
    },
    methods: {
      handleClickEvent (idx) {
        if (idx === 0) {
          this.$emit('confirm')
        } else if (idx === 1) {
          if (!this.$listeners.cancel) {
            this.$router.back()
          } else {
            this.$emit('cancel')
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
.batch-sticky-footer {
  /deep/ .footer {
    justify-content: end;
  }
}
</style>
