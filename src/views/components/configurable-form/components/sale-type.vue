<template>
  <div class="sale-type">
    <RadioGroup :disabled="disabled" :value="saleType" @on-change="handleChange">
      <Radio :disabled="disabled" :label="PRODUCT_SALE_TYPE.NORMAL">正常售卖</Radio>
      <Radio :disabled="disabled" :label="PRODUCT_SALE_TYPE.PRE">预售</Radio>
      <a class="show-link" @click.prevent="openView">c端效果展示</a>
    </RadioGroup>
    <div class="field" v-if="saleType === PRODUCT_SALE_TYPE.PRE">
      <span class="label required">发货时间</span>
      <DatePicker
        :value="deliveryTime"
        :disabled="disabled"
        :options="rangeOptions"
        placement="bottom-end"
        format="yyyy-MM-dd HH:mm"
        type="date"
        placeholder="请选择发货时间"
        :clearable="false"
        style="width: 250px"
        @on-change="handleDateChange"
      >
      </DatePicker>
    </div>
    <Modal
      v-model="imgModal"
      title="c端效果展示图"
      footer-hide
      width="720"
    >
      <img style="width: 680px; height: 680px; object-fit: contain;" :src="preSaleImg" alt="c端效果展示">
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
        return this.value.deliveryTime ? new Date(this.value.deliveryTime) : getToday().add(1, 'days')
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
          deliveryTime: (new Date(v)).getTime()
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
