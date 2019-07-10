<template>
  <div>
    <RadioGroup :value="Number(status)" @on-change="handleStatusChange">
      <Radio :label="0"><slot name="close">关</slot></Radio>
      <Radio :label="1"><slot name="open">开</slot></Radio>
    </RadioGroup>
    <PeriodWeekTime v-if="!!status" :value="value" @change="handleTimeChange"></PeriodWeekTime>
  </div>
</template>
<script>
  import PeriodWeekTime from '@components/period-week-time'

  export default {
    name: 'sell-time',
    props: {
      status: Boolean,
      value: {
        type: Object,
        required: true
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
