<template>
  <transition-group :name="transitionName" tag="div">
    <div v-for="(item, index) in value" :key="`${index}`" class="timezone-item">
      <RangeTimePicker
        :format="format"
        :startTime="item.start | timeMoment(format)"
        :endTime="item.end | timeMoment(format)"
        :disabled="disabled"
        @change="
          (startTime, endTime) => handleTimeChanged(index, startTime, endTime)
        "
      >
        <template slot="separator">
          <slot name="separator" />
        </template>
      </RangeTimePicker>
      <span v-if="!disabled" v-show="value.length < max" class="timezone-item-op-add" title="添加" @click="addItem(index)">
        <Icon local="add-plus" size=16 />添加
      </span>
      <span v-if="!disabled" v-show="value.length > 1" title="移除" class="timezone-item-op-remove" @click="deleteItem(index)">
        <Icon local="circle-remove" size=16 />移除
      </span>
    </div>
  </transition-group>
</template>

<script>
  import moment from 'moment'
  import RangeTimePicker from '../range-time-picker'

  const convertTimeToString = (time, format = 'HH:mm', empty = '') =>
    time ? time.format(format) : empty

  export default {
    name: 'period-week-time-zone',
    props: {
      transitionName: String,
      disabled: Boolean,
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

<style lang="less" scoped>
.timezone-item {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  &-op {
    &-add {
      color: @link-color;
    }
    &-remove {
      color: @primary-color;
    }
    &-add, &-remove {
      font-size: @font-size-base;
      display: inline-block;
      margin-left: 15px;
      vertical-align: middle;
      line-height: 32px;
      cursor: pointer;
      i {
        margin-top: -2px;
        margin-right: 5px;
      }
    }
  }
}
</style>
