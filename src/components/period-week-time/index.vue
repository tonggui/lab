<template>
  <div>
    <CheckButtonGroup
      :options="convertToWeekGroupOptions(labels)"
      :value="days"
      @change="handleWeekChanged"
      class="period-week-time-check-group"
    />
    <TimeZone :value="timezone" @change="handleTimeZoneChanged" />
  </div>
</template>

<script>
import TimeZone from './time-zone'
import { CheckButtonGroup } from '../check-button'

const convertToWeekAndTimes = (value = []) => {
  let timezone = []
  const validTimezoneItem = value.find(
    item => item && item.timezone && item.timezone.length > 0
  )
  if (validTimezoneItem) timezone = validTimezoneItem.timezone || []

  const days = value
    .filter(item => item && item.timezone.length === timezone.length)
    .map(item => item.day)
  return {
    days,
    timezone
  }
}

const convertWeekAndTimesToValue = (days = [], timezone = []) =>
  days.map(day => ({
    day,
    timezone
  }))

const convertToWeekGroupOptions = (labels = []) => {
  if (labels.length !== 7) throw new Error('每周日期必须为7天')
  return labels.map((label, index) => ({
    label,
    value: index
  }))
}
/**
 * event {change}
 */
export default {
  name: 'period-week-time',
  props: {
    value: {
      type: Array,
      default: null
    },
    labels: {
      type: Array,
      default: () => ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  data () {
    return {
      days: null,
      timezone: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        const { days, timezone } = convertToWeekAndTimes(val || [])
        this.days = days
        if (timezone.length <= 0) {
          this.timezone = [{}]
        } else {
          this.timezone = timezone
        }
      }
    }
  },
  methods: {
    handleWeekChanged (days) {
      this.days = days
      this.$emit('change', convertWeekAndTimesToValue(days, this.timezone))
    },
    handleTimeZoneChanged (timezone) {
      this.timezone = timezone
      this.$emit('change', convertWeekAndTimesToValue(this.days, timezone))
    },
    convertToWeekGroupOptions
  },
  components: {
    TimeZone,
    CheckButtonGroup
  }
}
</script>

<style lang="less">
.period-week-time-check-group {
  display: flex;
  align-items: center;
  button {
    margin-right: 10px;
  }
}
</style>
