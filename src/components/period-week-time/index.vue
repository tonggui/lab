<template>
  <div>
    <CheckboxGroup :value="value.days" @on-change="handleWeekChanged" class="period-week-time-check-group">
      <Checkbox v-for="item in options" :label="item.value" :key="item.value">{{ item.label }}</Checkbox>
    </CheckboxGroup>
    <TimeZone :value="timeList" @change="handleTimeZoneChanged" :transition-name="transitionName">
      <template slot="separator">
        <slot name="separator" />
      </template>
    </TimeZone>
  </div>
</template>

<script>
  import TimeZone from './time-zone'

  /**
   * event {change}
   */
  export default {
    name: 'period-week-time',
    props: {
      transitionName: String,
      value: {
        type: Object,
        required: true
      },
      items: {
        type: Array,
        default: () => ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    },
    computed: {
      options () {
        if (this.items.length !== 7) throw new Error('每周日期必须为7天')
        return this.items.map((label, index) => ({
          label,
          value: index
        }))
      },
      timeList () {
        if (!this.value.timeList || this.value.timeList.length <= 0) {
          return [{}]
        }
        return this.value.timeList
      }
    },
    methods: {
      handleWeekChanged (days) {
        this.days = days.sort((prev, next) => prev - next)
        this.$emit('change', { ...this.value, days })
      },
      handleTimeZoneChanged (timeList) {
        this.$emit('change', { ...this.value, timeList })
      }
    },
    components: {
      TimeZone
    }
  }
</script>

<style lang="less">
.period-week-time-check-group {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /deep/ .boo-checkbox {
    vertical-align: middle;
  }
  /deep/ .boo-checkbox-wrapper {
    line-height: 1;
  }
  /deep/ .boo-checkbox-wrapper:not(:last-child) {
    margin-right: 20px;
  }
}
</style>
