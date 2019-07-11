<template>
  <div>
    <RadioGroup :value="Number(status)" @on-change="handleStatusChange">
      <Radio :label="0">关</Radio>
      <Radio :label="1">开</Radio>
    </RadioGroup>
    <PeriodWeekTime v-if="!!status" :value="value" @change="handleTimeChange"></PeriodWeekTime>
  </div>
</template>
<script>
  import PeriodWeekTime from '@components/period-week-time'

  export default {
    name: 'SellTime',
    props: {
      status: Boolean,
      value: {
        type: Array,
        default: () => []
      }
    },
    components: {
      PeriodWeekTime
    },
    methods: {
      handleStatusChange (status) {
        this.$emit('change', Boolean(status), status ? this.value : [])
      },
      handleTimeChange (value) {
        this.$emit('change', this.status, value)
      }
    }
  }
</script>
