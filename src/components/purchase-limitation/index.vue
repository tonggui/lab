<template>
  <div class="purchase-limitation">
    <RadioGroup :value="Number(status)" @on-change="handleStatusChange">
      <Radio :label="0"><slot name="close">不限制</slot></Radio>
      <Radio :label="1"><slot name="open">限制</slot></Radio>
      <Tooltip
        placement="bottom"
        max-width="225px"
        content="针对特殊商品，需要限制每个买家在周期内可购买的数量时，可以开启限购"
      >
        <Icon class="tip" local="question-circle"/>
      </Tooltip>
    </RadioGroup>
    <div class="limitation">
      <div class="field">
        <span class="label required">限制日期</span>
          <Tooltip
          placement="bottom"
          max-width="225px"
          content="超过截止日期后将不再进行限购"
        >
          <Icon class="tip" local="question-circle"/>
        </Tooltip>
        <DatePicker type="daterange" :options="rangeOptions" placement="bottom-end" placeholder="请选择购买周期" style="width: 250px"></DatePicker>
      </div>
      <div class="field">
        <span class="label required">限制周期</span>
        <DatePicker type="daterange" :options="rangeOptions" placement="bottom-end" placeholder="请选择购买周期" style="width: 250px"></DatePicker>
      </div>
    </div>
  </div>
</template>
<script>
  function getRangeByDays (num) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
    return [start, end]
  }
  export default {
    name: 'purchase-limitation',
    props: {
      value: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        rangeOptions: {
          shortcuts: [
            {
              text: '7天',
              value () {
                return getRangeByDays(7)
              }
            },
            {
              text: '30天',
              value () {
                return getRangeByDays(30)
              }
            }
          ]
        }
      }
    },
    methods: {
      handleStatusChange (status) {
        this.$emit('change', { ...this.value, status })
      },
      handleRangeChange (range) {
        this.$emit('change', { ...this.value, range })
      },
      handleMaxChange (max) {
        this.$emit('change', { ...this.value, max })
      },
      validate () {
        console.log(1)
      }
    }
  }
</script>
<style lang="less" scoped>
  .purchase-limitation {
    /deep/ .boo-radio-wrapper {
      margin-right: 15px;
      .boo-radio {
        margin-right: 5px;
      }
    }
  }
</style>
