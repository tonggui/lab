<template>
  <div class="container">
    <div v-if="!hasAttr" @click="handleAddSku">
      <span class="add">
        <Icon local="add-plus" size=16 />添加规格
      </span>
      <small class="helper-text">可添加商品规格，对应生成以下规格列表</small>
    </div>
    <Columns
      :hasAttr="hasAttr"
      :skuCount="value.length"
      :supportPackingBag="supportPackingBag"
      :hasMinOrderCount="hasMinOrderCount"
      :hasStock="hasStock"
      :requiredWeight="requiredWeight"
      @on-delete="handleDeleteSku"
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
      hasMinOrderCount: Boolean,
      hasStock: Boolean,
      supportPackingBag: Boolean,
      whiteList: Object
    },
    computed: {
      hasAttr () {
        return this.attrList && this.attrList.length > 0
      },
      requiredWeight () {
        const whiteList = (this.whiteList || {}).required || {}
        if (whiteList.weight) {
          return !!whiteList.weight
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
      handleDeleteSku (index) {
        const skuList = [...this.value]
        skuList.splice(index, 1)
        this.handleChange(skuList, this.attrList, this.selectAttrMap)
      },
      handleOptionChange (attrList, selectAttrMap) {
        this.handleChange(this.value, attrList, selectAttrMap)
      },
      handleTableChange (skuList) {
        this.handleChange(skuList)
      },
      handleChange (skuList, attrList, selectAttrMap) {
        this.$emit('on-change', skuList, attrList, selectAttrMap)
      },
      async validate () {
        const result = await this.$refs.sellInfo.validator()
        if (result) throw new Error(result)
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
      display: inline-flex;
      align-items: center;
      color: @link-color;
      cursor: pointer;
      vertical-align: middle;
      /deep/ i {
        margin-right: 5px;
      }
    }
    .helper-text {
      color: @text-tip-color;
      margin-left: 5px;
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
