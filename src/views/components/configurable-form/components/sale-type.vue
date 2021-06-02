<template>
  <div class="sale-type">
    <RadioGroup :disabled="disabled" :value="saleType" @on-change="handleChange">
      <Radio :disabled="disabled" :label="PRODUCT_SALE_TYPE.NORMAL">正常售卖</Radio>
      <Tooltip
        style="margin-left:-5px; margin-right:20px;"
        placement="top"
        max-width="225px"
        content="买家购买“正常售卖”商品，接单后要正常发货并完成及时配送"
      >
        <Icon class="tip" local="question-circle"/>
      </Tooltip>
      <Radio :disabled="disabled" :label="PRODUCT_SALE_TYPE.PRE">预售</Radio>
      <Tooltip
        style="margin-left:-5px; margin-right:15px;"
        placement="top"
        max-width="225px"
        content="买家购买“预售”商品，接单后可不用立即发货，可按照用户选择的指定送达时间完成发货配送（用户选择的送达时间不会早于您设置的“发货时间”）。注：修改售卖方式会导致该商品生效中和待生效的的营销活动下线，请谨慎修改。"
      >
        <Icon class="tip" local="question-circle"/>
      </Tooltip>
      <a class="show-link" @click.prevent="openView">用户端效果展示</a>
    </RadioGroup>
    <div class="field" v-if="saleType === PRODUCT_SALE_TYPE.PRE">
      <span class="label required">发货时间</span>
      <DatePicker
        type="datetime"
        :value="deliveryTime"
        :disabled="disabled"
        :options="rangeOptions"
        placement="bottom-end"
        format="yyyy-MM-dd HH:mm:ss"
        placeholder="请选择发货时间"
        style="width: 250px"
        @on-change="handleDateChange"
      >
      </DatePicker>
    </div>
    <Modal
      v-model="imgModal"
      title="用户端效果展示"
      footer-hide
      width="590"
    >
      <img style="width: 550px; height: 550px;" :src="preSaleImg" alt="用户端效果展示">
    </Modal>
  </div>
</template>

<script>
  import { PRODUCT_SALE_TYPE } from '@/data/enums/product'
  import moment from 'moment'
  import preSaleImg from '@/assets/pre-sale-img.png'

  const getToday = () => moment().startOf('day')
  export default {
    name: 'sale-type',
    props: {
      disabled: Boolean,
      value: Object
    },
    data () {
      return {
        PRODUCT_SALE_TYPE,
        rangeOptions: {
          disabledDate (date) {
            const valid = date && moment(date).isAfter(getToday()) && moment(date).isBefore(getToday().add(33, 'days'))
            return !valid
          }
        },
        imgModal: false,
        preSaleImg
      }
    },
    computed: {
      saleType () {
        return this.value.saleType
      },
      deliveryTime () {
        return this.value.deliveryTime ? new Date(this.value.deliveryTime) : ''
      }
    },
    methods: {
      handleChange (v) {
        this.$emit('change', {
          saleType: v,
          deliveryTime: (new Date(this.deliveryTime)).getTime()
        })
      },
      handleDateChange (v) {
        this.$emit('change', {
          saleType: this.saleType,
          deliveryTime: v ? (new Date(v)).getTime() : ''
        })
      },
      openView () {
        this.imgModal = true
      }
    }
  }
</script>

<style scoped lang="less">
  .sale-type {
    .show-link {
      text-decoration: underline;
    }
    .field {
      display: flex;
      margin-top: 15px;
      margin-left: -65px;
      margin-bottom: 10px;
      font-size: 12px;
      .label {
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
  }
</style>
