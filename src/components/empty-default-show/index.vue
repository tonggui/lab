<template>
  <span>{{ showValue }}</span>
</template>
<script>
  export default {
    name: 'empty-default-show',
    props: {
      value: [Number, String],
      emptyShow: {
        type: String,
        default: '--'
      }
    },
    computed: {
      showValue () {
        if (this.value === undefined || this.value === null || this.value === '') {
          return this.emptyShow
        }
        return this.value
      }
    }
  }
</script>
