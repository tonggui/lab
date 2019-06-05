<template>
  <div class="wrapper">
    <TimePicker
      :value="startTimeSelf"
      :maxTime="endTimeSelf"
      :format="format"
      placeholder="请选择时间"
      @change="time => handleTimeChanged(time, endTimeSelf)"
    />
    <slot name="separator"><span class="separator">—</span></slot>
    <TimePicker
      :value="endTimeSelf"
      :minTime="startTimeSelf"
      :format="format"
      placeholder="请选择时间"
      @change="time => handleTimeChanged(startTimeSelf, time)"
    />
  </div>
</template>

<script>
import Moment from 'moment'
import TimePicker from './time-picker'
/**
 * event {change}
 */
export default {
  name: 'range-time-picker',
  props: {
    format: {
      type: String,
      default: 'HH:mm'
    },
    startTime: {
      type: Moment,
      default: null
    },
    endTime: {
      type: Moment,
      default: null
    }
  },
  data () {
    return {
      startTimeSelf: null,
      endTimeSelf: null
    }
  },
  watch: {
    startTime: {
      immediate: true,
      handler (val) {
        this.startTimeSelf = val
      }
    },
    endTime: {
      immediate: true,
      handler (val) {
        this.endTimeSelf = val
      }
    }
  },
  methods: {
    handleTimeChanged (startTime, endTime) {
      this.startTimeSelf = startTime
      this.endTimeSelf = endTime
      this.$emit('change', startTime, endTime)
    }
  },
  components: {
    TimePicker
  }
}
</script>

<style scoped lang="less">
.wrapper {
  display: inline-block;

  .separator {
    color: var(--gray-3);
    margin-left: 10px;
    margin-right: 10px;
  }

  :global {
    .ant-time-picker + .ant-time-picker {
      margin-left: 10px;
    }
  }
}
</style>
