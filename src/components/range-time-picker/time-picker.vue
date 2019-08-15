<template>
  <TimePicker
    :format="format"
    :disabled-hours="disabledHoursSelf"
    :disabled-minutes="disabledMinutesSelf"
    :disabled-seconds="disabledSecondsSelf"
    :value="valueSelf && new Date(valueSelf)"
    @on-change="handleChanged"
  />
</template>

<script>
  import Moment from 'moment'
  import range from 'lodash/range'

  const Hours = range(0, 24)
  const Minutes = range(0, 60)
  const Seconds = range(0, 60)

  const computeDisabledHours = (maxTime, minTime) => {
    const maxHour = maxTime ? maxTime.hours() : 23
    const minHour = minTime ? minTime.hours() : 0
    return () => Hours.filter(item => item > maxHour || item < minHour)
  }

  const computeDisabledMinutes = (maxTime, minTime) => {
    const maxHour = maxTime ? maxTime.hours() : 23
    const minHour = minTime ? minTime.hours() : 0
    const maxMinute = maxTime ? maxTime.minutes() : 59
    const minMinute = minTime ? minTime.minutes() : 0
    return selectedHour => {
      if (selectedHour === minHour) {
        return Minutes.filter(minute => minute < minMinute)
      } else if (selectedHour === maxHour) {
        return Minutes.filter(minute => minute > maxMinute)
      } else {
        return []
      }
    }
  }

  const computeDisabledSeconds = (maxTime, minTime) => {
    const maxHour = maxTime ? maxTime.hours() : 23
    const minHour = minTime ? minTime.hours() : 0
    const maxMinute = maxTime ? maxTime.minutes() : 59
    const minMinute = minTime ? minTime.minutes() : 0
    const maxSecond = maxTime ? maxTime.seconds() : 59
    const minSecond = minTime ? minTime.seconds() : 0
    return (selectedHour, selectedMinute) => {
      if (selectedHour === minHour && selectedMinute === minMinute) {
        return Seconds.filter(second => second < minSecond)
      } else if (selectedHour === maxHour && selectedMinute === maxMinute) {
        return Seconds.filter(second => second > maxSecond)
      } else {
        return []
      }
    }
  }
  /**
   * events {change}
   */
  export default {
    name: 'time-picker',
    props: {
      format: String,
      minTime: {
        type: Moment,
        default: null
      },
      maxTime: {
        type: Moment,
        default: null
      },
      use12Hours: {
        type: Boolean,
        default: false
      },
      value: {
        type: Moment,
        default: null
      },
      disabledHours: {
        type: Boolean,
        default: false
      },
      disabledMinutes: {
        type: Boolean,
        default: false
      },
      disabledSeconds: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        valueSelf: null
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          this.valueSelf = val
        }
      }
    },
    computed: {
      disabledHoursSelf () {
        return (
          this.disabledHours || computeDisabledHours(this.maxTime, this.minTime)()
        )
      },
      disabledMinutesSelf () {
        return (
          this.disabledMinutes ||
          computeDisabledMinutes(this.maxTime, this.minTime)(
            this.valueSelf && this.valueSelf.hours()
          )
        )
      },
      disabledSecondsSelf () {
        return (
          this.disabledSeconds ||
          computeDisabledSeconds(this.maxTime, this.minTime)(
            this.valueSelf && this.valueSelf.hours(),
            this.valueSelf && this.valueSelf.minutes()
          )
        )
      }
    },
    methods: {
      handleChanged (time) {
        let times = null
        if (time) {
          times = time.split(':')
          times = Moment().set({
            hour: +times[0],
            minute: +times[1],
            second: +times[2]
          })
        }
        this.valueSelf = times
        this.$emit('change', times)
      }
    }
  }
</script>

<style scoped></style>
