<template>
  <div>
    <RadioGroup :value="Number(status)" @on-change="handleStatusChange">
      <Radio :label="0"><slot name="close">关</slot></Radio>
      <Radio :label="1"><slot name="open">开</slot></Radio>
    </RadioGroup>
    <PeriodWeekTime v-if="!!status" :value="times" @change="handleTimeChange"></PeriodWeekTime>
  </div>
</template>
<script>
  import PeriodWeekTime from '@/components/period-week-time'

  export default {
    name: 'sell-time',
    components: {
      PeriodWeekTime
    },
    props: {
      status: Boolean,
      value: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        times: this.value
      }
    },
    watch: {
      value (val) {
        this.times = val
      },
      status (val) {
        if (val) {
          const days = this.times.days || []
          if (days.length === 0) {
            this.times.days = [0, 1, 2, 3, 4, 5, 6]
            this.handleTimeChange(this.times)
          }
        }
      }
    },
    methods: {
      handleStatusChange (status) {
        this.$emit('change', Boolean(status), status ? this.value : {})
      },
      handleTimeChange (value) {
        this.$emit('change', this.status, value)
      }
    }
  }
</script>
