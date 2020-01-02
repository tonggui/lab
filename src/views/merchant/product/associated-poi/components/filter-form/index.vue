<template>
  <Form inline label-position="left" class="associated-poi-filter-form">
    <FormItem props="poiId" label="选择门店">
      <SelectPoi v-model="selfFilterData.poiId" :fetchData="fetchGetPoiList" placeholder="请选择门店" />
    </FormItem>
    <FormItem props="exist" label="是否存在">
      <Select v-model="selfFilterData.exist" style="width: 160px">
        <Option v-for="item in existOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem props="sellStatus" label="上/下架状态" v-show="productExist">
      <Select v-model="selfFilterData.sellStatus" style="width: 160px">
        <Option v-for="item in statusOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem props="stockStatus" label="库存情况" v-show="productExist">
      <Select v-model="selfFilterData.stockStatus" style="width: 160px">
        <Option v-for="item in stockOptions" :key="item.value" :value="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="价格区间" v-show="productExist">
      <NumberRange :min="0" :max="30000" :precision="2" @change="handleChangePrice" />
    </FormItem>
    <FormItem class="form-btn-group">
      <Button @click="handleReset">重置</Button>
      <Button type="primary" @click="handleSearch" v-mc="{ bid: 'b_shangou_online_e_peq1c8pi_mc' }">查询</Button>
    </FormItem>
  </Form>
</template>
<script>
  import { isEqual } from 'lodash'
  import {
    existOptions,
    statusOptions,
    stockOptions,
    defaultData,
    EXIST_TYPE
  } from '../../constants'
  import {
    fetchGetPoiList
  } from '@/data/repos/merchantPoi'
  import SelectPoi from '@components/selector-loadmore'
  import NumberRange from '@components/number-range'

  export default {
    name: 'associated-poi-filter-form',
    components: {
      SelectPoi,
      NumberRange
    },
    props: {
      filterData: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        existOptions,
        statusOptions,
        stockOptions,
        fetchGetPoiList,
        selfFilterData: {
          ...this.filterData
        }
      }
    },
    computed: {
      productExist () {
        return this.selfFilterData.exist !== EXIST_TYPE.EXCLUDE
      }
    },
    watch: {
      filterData (filterData) {
        if (!isEqual(filterData, this.selfFilterData)) {
          this.selfFilterData = { ...this.filterData }
        }
      }
    },
    methods: {
      handleSearch () {
        if (!this.productExist) {
          this.selfFilterData.stockStatus = defaultData.stockStatus
          this.selfFilterData.sellStatus = defaultData.sellStatus
          this.selfFilterData.minPrice = defaultData.minPrice
          this.selfFilterData.maxPrice = defaultData.maxPrice
        }
        this.$emit('submit', this.selfFilterData)
      },
      handleReset () {
        this.selfFilterData = { ...defaultData }
        this.$emit('submit', this.selfFilterData)
      },
      handleChangePrice ([min, max]) {
        this.selfFilterData.minPrice = min
        this.selfFilterData.maxPrice = max
      }
    }
  }
</script>
<style lang="less" scoped>
  .associated-poi-filter-form {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    /deep/ .boo-form-item {
      display: inline-flex;
    }
    .form-btn-group {
      display: inline-block;
      margin-left: 20px;
      /deep/ .boo-btn:not(:first-of-type) {
        margin-left: 10px;
      }
    }
  }
</style>
