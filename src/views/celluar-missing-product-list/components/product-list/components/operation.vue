<template>
  <Button type="primary" :disabled="disabled" @click="handlePutOn" :loading="submitting">上架</Button>
</template>
<script>
  export default {
    name: 'celluar-missing-product-operation',
    props: {
      disabled: Boolean,
      product: {
        type: Object,
        required: true
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    data () {
      return {
        submitting: false
      }
    },
    methods: {
      handlePutOn () {
        this.submitting = true
        this.$emit('put-on', this.product, this.createCallback(() => {
          this.submitting = false
        }, (err) => {
          console.error(err)
          this.submitting = false
        }))
      }
    }
  }
</script>
<style lang="less">
  .celluar-missing-product-operation {
  }
</style>
