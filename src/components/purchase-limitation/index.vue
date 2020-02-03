<template>
  <div class="purchase-limitation">
    <div class="field">
      <RadioGroup :value="status" @on-change="handleStatusChange">
        <Radio :label="0"><slot name="close">不限制</slot></Radio>
        <Radio :label="1"><slot name="open">限制</slot></Radio>
      </RadioGroup>
      <span class="alert">设置后对全部规格商品均生效</span>
    </div>
    <div class="limitation" v-show="status">
      <div class="field">
        <span class="label required">限制周期</span>
        <DatePicker
          :value="range"
          type="daterange"
          :options="rangeOptions"
          placement="bottom-end"
          placeholder="请选择购买周期"
          style="width: 250px"
          @on-change="handleRangeChange"
        >
        </DatePicker>
        <span class="alert" style="margin-left: 10px">超过截止日期后将不再进行限购</span>
      </div>
      <div class="field">
        <span class="label required">单个买家购买规则</span>
        <div class="content">
          <span style="margin-right: 5px">每</span>
          <Select :value="rule" style="width:120px" @on-change="handleRuleChange">
            <Option v-for="rule in rules" :value="rule.value" :key="rule.value">{{ rule.label }}</Option>
          </Select>
          <span style="margin: 0 5px">购买数量上限</span>
          <InputNumber :min="1" :value="max" @on-change="handleMaxChange"></InputNumber>
        </div>
      </div>
      <p class="desc">温馨提示：在限购周期内按照每个买家进行限制，请合理设置（限购数针对每个规格单独生效，比如限购10份，则规格1、规格2、规格n可以各买10份）</p>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  const today = moment().startOf('day')

  function getRangeByDays (num) {
    const d = moment().startOf('day')
    return [d.toDate(), d.add(num - 1, 'd').toDate()]
  }

  const DAILY_TYPE = 1
  const PERIOD_TYPE = 2

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
        rules: [
          { value: DAILY_TYPE, label: '1天' },
          { value: PERIOD_TYPE, label: '整个限制周期' }
        ],
        rangeOptions: {
          disabledDate (date) {
            const valid = date && moment(date).isBefore(today)
            return valid
          },
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
    computed: {
      status () {
        return this.value.status || 0
      },
      range () {
        return this.value.range || []
      },
      rule () {
        return this.value.rule || 0
      },
      max () {
        return this.value.max || 0
      }
    },
    methods: {
      handleStatusChange (status) {
        this.$emit('change', { ...this.value, status })
      },
      handleRangeChange (range = []) {
        const oldRange = this.value.range || []
        this.$emit('change', { ...this.value, range })
        const [from = today.toDate(), to = today.toDate()] = range
        // 超过30天
        if (moment(to).isSameOrAfter(moment(from).add(30, 'd'))) {
          this.$Message.warning('限制周期不能超过30天')
          this.$nextTick(() => {
            this.$emit('change', { ...this.value, range: [...oldRange] })
          })
        }
      },
      handleRuleChange (rule) {
        const [from = today.toDate(), to = today.toDate()] = this.value.range
        const fromD = moment(from)
        const toD = moment(to)
        // 已有开始时间在今天之前并且截止时间在今天之后，自动将开始时间置为今天，并提示
        if (fromD.isBefore(today) && toD.isSameOrAfter(today)) {
          this.$emit('change', { ...this.value, range: [today.format('YYYY-MM-DD'), toD.format('YYYY-MM-DD')], rule })
          this.$Message.warning('限购规则变更，限购开始日期变更为当前日期')
        } else {
          this.$emit('change', { ...this.value, rule })
        }
      },
      handleMaxChange (max) {
        this.$emit('change', { ...this.value, max })
      },
      validate () {
        const { status = 0, range = [], rule, max = 0 } = this.value
        if (!status) return '' // 不限制的话不进行校验
        if (!range.length || range.some(v => !v)) return '限购周期不能为空'
        if (!rule) return '请选择限购规则'
        if (!max) return '购买数量上限至少为1'
      }
    }
  }
</script>
<style lang="less" scoped>
  .purchase-limitation {
    .tip {
      position: absolute;
    }
    .field {
      display: flex;
      margin-bottom: 10px;
      .label {
        font-size: @font-size-base;
        position: relative;
        margin: 10px 20px 0 0;
        line-height: 1;
        &.required:after {
          position: absolute;
          content: '*';
          display: inline-block;
          margin-left: 2px;
          line-height: 1;
          font-size: 12px;
          top: 0;
          color: @text-red;
        }
      }
      .content {
        display: flex;
        align-items: center;
      }
    }
    .alert {
      color: @error-color;
      vertical-align: middle;
    }
    .desc {
      color: @text-description-color;
      font-size: @font-size-small;
    }
    /deep/ .boo-input-wrapper {
      width: 100%;
    }
    /deep/ .boo-radio-group {
      font-size: 0;
    }
    /deep/ .boo-radio-wrapper {
      margin-right: 15px;
      .boo-radio {
        margin-right: 5px;
      }
    }
  }
</style>
