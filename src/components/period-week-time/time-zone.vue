<template>
  <div>
    <div v-for="(item, index) in value" :key="index" class="timezone-item">
      <RangeTimePicker
        :format="format"
        :startTime="item.start | timeMoment(format)"
        :endTime="item.end | timeMoment(format)"
        @change="
          (startTime, endTime) => handleTimeChanged(index, startTime, endTime)
        "
      />
      <Button
        v-show="value.length < max"
        class="timezone-item-btn"
        shape="circle"
        icon="add"
        type="primary"
        size="small"
        @click="addItem(index)"
      />
      <Button
        v-show="value.length > 1"
        class="timezone-item-btn"
        shape="circle"
        icon="remove"
        type="primary"
        size="small"
        @click="deleteItem(index)"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import RangeTimePicker from '../range-time-picker'

const convertTimeToString = (time, format = 'HH:mm', empty = '') =>
  time ? time.format(format) : empty

export default {
  name: 'period-week-time-zone',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default: 'HH:mm'
    },
    max: {
      type: Number,
      default: 5
    }
  },
  filters: {
    timeMoment (val, format) {
      return val ? moment(val, format) : null
    }
  },
  methods: {
    addItem (idx) {
      const list = [...this.value]
      list.splice(idx + 1, 0, {})
      this.handleChange(list)
    },
    deleteItem (idx) {
      const list = [...this.value]
      list.splice(idx, 1)
      this.handleChange(list)
    },
    handleTimeChanged (idx, startTime, endTime) {
      const list = [...this.value]
      const start = convertTimeToString(startTime, this.format)
      const end = convertTimeToString(endTime, this.format)
      const item = {
        start,
        end,
        time: `${start}-${end}`
      }
      list.splice(idx, 1, item)
      this.handleChange(list)
    },
    handleChange (list) {
      this.$emit('change', list)
    }
  },
  components: {
    RangeTimePicker
  }
}
</script>

<style scoped>
.timezone-item {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.timezone-item-btn {
  margin-left: 10px;
}
</style>
