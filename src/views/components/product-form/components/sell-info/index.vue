<template>
  <div class="container">
    <div v-if="!hasAttr" @click="handleAddSku">
      <span class="add">
        <Icon type="add" />添加规格
      </span>
      <small class="helper-text">可添加商品规格，对应生成以下规格列表</small>
    </div>
    <Columns
      :hasAttr="hasAttr"
      :skuCount="value.length"
      :supportPackingBag="supportPackingBag"
      :categoryAttrSwitch="categoryAttrSwitch"
      :requiredWeight="requiredWeight"
    >
      <template v-slot:default="{columns}">
        <SellInfo
          :options="attrList"
          :value="selectAttrMap"
          :dataSource="value"
          :rowKey="getRowKey"
          :columns="columns"
          descartesKey="categoryAttrList"
          optionValueKey="name"
          :generateItem="generateItem"
          :generateOption="generateOption"
          @on-table-change="handleTableChange"
          @on-option-change="handleOptionChange"
          ref="sellInfo"
        />
      </template>
    </Columns>
  </div>
</template>
<script>
  import SellInfo from './sell-info'
  import Columns from './columns'
  import {
    createSku,
    createAttrValue
  } from '@/data/helper/product/operation'

  export default {
    name: 'product-sell-info-container',
    props: {
      attrList: Array,
      selectAttrMap: Object,
      value: Array,
      categoryAttrSwitch: Boolean,
      supportPackingBag: Boolean,
      whiteList: Object
    },
    computed: {
      hasAttr () {
        return this.attrList && this.attrList.length > 0
      },
      requiredWeight () {
        const whiteList = this.whiteList || {}
        if (whiteList.weight) {
          return !!whiteList.weight.required
        }
        return true
      }
    },
    components: {
      SellInfo,
      Columns
    },
    methods: {
      getRowKey (item) {
        return item.__id__
      },
      generateItem () {
        return createSku()
      },
      generateOption (parent, name, index) {
        return createAttrValue(parent, name, index)
      },
      handleAddSku () {
        const newSkuItem = this.generateItem()
        const skuList = [...this.value, newSkuItem]
        this.handleChange(skuList, this.attrList, this.selectAttrMap)
      },
      handleOptionChange (attrList, selectAttrMap) {
        this.handleChange(this.value, attrList, selectAttrMap)
      },
      handleTableChange (skuList) {
        this.handleChange(skuList, this.attrList, this.selectAttrMap)
      },
      handleChange (skuList, attrList, selectAttrMap) {
        this.$emit('on-change', skuList, attrList, selectAttrMap)
      }
    },
    mounted () {
      if (!this.value || this.value.length <= 0) {
        this.handleAddSku()
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    background: @component-bg;
    .add {
      color: @link-color;
      cursor: pointer;
    }
    /deep/ .boo-input {
      max-width: 160px;
      min-width: 60px;
    }
    /deep/ .boo-input-wrapper {
      width: initial;
    }
  }
</style>
