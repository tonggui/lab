<template>
  <div class="purchase-limitation">
    <div class="limitation">
      <div class="field" v-if="!poiId">
        <span class="label">是否允许在多个门店重复购买</span>
        <RadioGroup :value="multiPoi" @on-change="handleMultiPoiChange">
          <Radio :label="1"><slot name="close">允许</slot></Radio>
          <Radio :label="0"><slot name="open">不允许</slot></Radio>
        </RadioGroup>
      </div>
      <div class="field">
        <span class="label required">限购周期</span>
        <DatePicker
          :value="range"
          :editable="false"
          :disabled="disabled"
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
          <Select :disabled="disabled" :value="rule" style="width:120px" @on-change="handleRuleChange">
            <Option v-for="rule in rules" :value="rule.value" :key="rule.value">{{ rule.label }}</Option>
          </Select>
          <span style="margin: 0 5px">每个用户限购</span>
          <InputNumber :disabled="disabled" :min="1" :value="max" @on-change="handleMaxChange"></InputNumber>
          <span style="margin: 0 5px">份</span>
        </div>
        <span class="alert" style="margin-left: 10px">如您在标题中添加了限购信息，请与限购数量保持一致</span>
      </div>
      <p class="desc">温馨提示：在限购周期内按照每个买家进行限制，请合理设置（限购数针对每个规格单独生效，比如限购10份，则规格1、规格2、规格n可以各买10份）</p>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import { getPoiId } from '@/common/constants'

  const getToday = () => moment().startOf('day')

  function getRangeByDays (num) {
    const d = getToday()
    return [d.toDate(), d.add(num - 1, 'd').toDate()]
  }

  const MAX_DURATION = 90

  const rules = []
  for (let i = 1; i <= 31; i++) {
    rules.push({ value: i, label: `${i}天` })
  }

  export default {
    name: 'purchase-limitation',
    props: {
      disabled: Boolean,
      value: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        poiId: getPoiId(),
        rules: [
          { value: 0, label: '整个限购周期' },
          ...rules
        ],
        rangeOptions: {
          disabledDate (date) {
            const valid = date && moment(date).isBefore(getToday().subtract(7, 'd'))
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
            },
            {
              text: '90天',
              value () {
                return getRangeByDays(90)
              }
            }
          ]
        }
      }
    },
    computed: {
      multiPoi () {
        return this.value.multiPoi ? 1 : 0
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
      handleMultiPoiChange (multiPoi) {
        this.$emit('change', { ...this.value, multiPoi })
      },
      handleRangeChange (range = []) {
        const today = getToday()
        const oldRange = this.value.range || []
        this.$emit('change', { ...this.value, range })
        const [from = today.toDate(), to = today.toDate()] = range
        // 不能超过最长时段限制
        if (moment(to).isSameOrAfter(moment(from).add(MAX_DURATION, 'd'))) {
          this.$Message.warning(`限购周期不能超过${MAX_DURATION}天`)
          this.$nextTick(() => {
            this.$emit('change', { ...this.value, range: [...oldRange] })
          })
        }
      },
      handleRuleChange (rule) {
        // const today = getToday()
        // const [from = today.toDate(), to = today.toDate()] = this.value.range
        // const fromD = moment(from)
        // const toD = moment(to)
        // // 已有开始时间在今天之前并且截止时间在今天之后，自动将开始时间置为今天，并提示
        // if (fromD.isBefore(today) && toD.isSameOrAfter(today)) {
        //   this.$emit('change', { ...this.value, range: [today.format('YYYY-MM-DD'), toD.format('YYYY-MM-DD')], rule })
        //   this.$Message.warning('限购规则变更，限购开始日期变更为当前日期')
        // } else {
        //   this.$emit('change', { ...this.value, rule })
        // }
        this.$emit('change', { ...this.value, rule })
      },
      handleMaxChange (max) {
        this.$emit('change', { ...this.value, max })
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
