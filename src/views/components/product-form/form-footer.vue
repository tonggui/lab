<template>
  <StickyFooter
    :gap="10"
    size="large"
    :btnTexts="[`${isCreate ? '确认发布商品' : '保存商品'}`, '取消']"
    :btnProps="[{loading}, {style: 'min-width: 100px'}]"
    @on-click="handleClick"
  />
</template>

<script>
  import { debounce } from 'lodash'
  import StickyFooter from '@/components/sticky-footer'
  export default {
    name: 'form-footer',
    components: {
      StickyFooter
    },
    props: {
      isCreate: Boolean,
      loading: Boolean,
      onConfirm: Function
    },
    methods: {
      handleClick: debounce(function (idx) {
        if (idx === 0) {
          this.triggerConfrimEvent()
        } else if (idx === 1) this.$emit('cancel')
      }, 300),
      async triggerConfrimEvent () {
        this.$emit('confirm')
        if (this.onConfirm) {
          this.loading = true
          try {
            await this.onConfirm()
          } finally {
            this.loading = false
          }
        }
      }
    }
  }
</script>
