<template>
  <div>
    <div v-for="(item, index) in transData" :key="index" class="timezone-item">
      <RangeTimePicker
        :format="format"
        :startTime="item.startTime"
        :endTime="item.endTime"
        @change="
          (startTime, endTime) => handleTimeChanged(index, startTime, endTime)
        "
      />
      <Button
        v-show="transData.length < max"
        class="timezone-item-btn"
        shape="circle"
        icon="add"
        type="primary"
        size="small"
        @click="addItem(index)"
      />
      <Button
        v-show="transData.length > 1"
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
  data () {
    return {
      valueSelf: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.valueSelf = val.length > 0 ? val : ['-']
      }
    }
  },
  computed: {
    transData () {
      return this.valueSelf.map(item => {
        const [start, end] = item.split('-')
        const pickerProps = {
          startTime: start ? moment(start, this.format) : null,
          endTime: end ? moment(end, this.format) : null
        }
        return {
          ...item,
          ...pickerProps
        }
      })
    }
  },
  methods: {
    addItem (idx) {
      this.valueSelf = [].concat(this.valueSelf)
      this.valueSelf.splice(idx + 1, 0, '-')
    },
    deleteItem (idx) {
      this.valueSelf = [].concat(this.valueSelf)
      this.valueSelf.splice(idx, 1)
    },
    handleTimeChanged (idx, startTime, endTime) {
      const newValue = [].concat(this.valueSelf)
      const item = `${convertTimeToString(startTime)}-${convertTimeToString(
        endTime
      )}`
      newValue[idx] = item
      this.valueSelf = newValue
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
