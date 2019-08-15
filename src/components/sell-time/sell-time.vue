<template>
  <div class="sell-time">
    <RadioGroup :value="Number(status)" @on-change="handleStatusChange">
      <Radio :label="0"><slot name="close">关</slot></Radio>
      <Radio :label="1"><slot name="open">开</slot></Radio>
    </RadioGroup>
    <PeriodWeekTime v-if="!!status" :value="times" @change="handleTimeChange" :transitionName="transitionName">
      <template slot="separator">
        <Icon type="minimize" class="separator-icon" />
      </template>
    </PeriodWeekTime>
  </div>
</template>
<script>
  import PeriodWeekTime from '@/components/period-week-time'
  import { validateTimezones } from './utils'

  export default {
    name: 'sell-time',
    components: {
      PeriodWeekTime
    },
    props: {
      transitionName: String,
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
      },
      validate () {
        if (!this.status) {
          return ''
        }
        const error = validateTimezones(this.value)
        return typeof error === 'string' ? error : ''
      }
    }
  }
</script>
<style lang="less" scoped>
  .sell-time {
    /deep/ .boo-radio-wrapper {
      margin-right: 15px;
      .boo-radio {
        margin-right: 5px;
      }
    }
  }
  .separator-icon {
    color: @icon-color;
    margin-top: -8px;
  }
</style>
