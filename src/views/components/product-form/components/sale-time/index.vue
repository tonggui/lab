<template>
  <SellTime
    :status="value.status"
    :value="value.value"
    @change="handleChange"
  />
</template>

<script>
  import SellTime from '@/components/sell-time'
  export default {
    name: 'SaleTime',
    components: {
      SellTime
    },
    props: {
      value: {
        type: Object,
        default: () => ({ status: false, value: { days: [], timeList: [] } })
      }
    },
    methods: {
      handleChange (status, value) {
        if (!this.value) this.value = {}
        this.value.status = status
        this.value.value = value

        this.$emit('input', this.value)
        this.$emit('on-change', this.value)
      }
    }
  }
</script>

<style scoped>

</style>
