<template>
  <div class="price-with-weight">
    <span>¥</span>
    <InputNumber class="input" :value="priceValue" />
    <span>约</span>
    <InputNumber class="input" :value="weightValue" />
    <Select transfer :value="weightUnit" @on-change="handleWeightUnitChange" class="select">
      <Option v-for="item in weightUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <span>/</span>
    <Select transfer :value="priceUnit" @on-change="handlePriceUnitChange" class="select">
      <Option v-for="item in priceUnitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>

<script>
  export default {
    name: 'price-with-weight',
    props: {
      value: {
        type: Array,
        default: () => ([])
      },
      priceUnitList: {
        type: Array,
        default: () => ([])
      },
      weightUnitList: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      priceValue () {
        return (this.value[0] || {}).value
      },
      priceUnit () {
        return (this.value[0] || {}).unit
      },
      weightValue () {
        return (this.value[1] || {}).value
      },
      weightUnit () {
        return (this.value[1] || {}).unit
      }
    },
    methods: {
      handlePriceValueChange (v) {

      },
      handlePriceUnitChange (v) {

      },
      handleWeightValueChange (v) {

      },
      handleWeightUnitChange (v) {

      }
    }
  }
</script>

<style lang="less" scoped>
  .price-with-weight {
    display: flex;
    align-items: center;
    .input {
      max-width: 60%;
      min-width: 70px;
    }
    & > span {
      display: inline-block;
      margin: 0 5px;
      &:first-of-type {
        margin-left: 0;
      }
    }
    .select {
      width: inherit;
      /deep/ .boo-select-selection {
        border: none;
        height: auto;
        background: transparent;
      }
    }
  }
</style>
