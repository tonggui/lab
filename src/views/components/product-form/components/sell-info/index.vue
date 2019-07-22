<template>
  <div class="container">
    <div v-if="!hasAttr" @click="handleAddSku">
      <span class="add">
        <Icon type="add" />添加规格
      </span>
      <small class="helper-text">可添加商品规格，对应生成以下规格列表</small>
    </div>
    <Columns :hasAttr="hasAttr" :skuCount="value.length">
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
  import Schema from 'async-validator'
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
      value: Array
    },
    computed: {
      hasAttr () {
        return this.attrList && this.attrList.length > 0
      }
    },
    components: {
      SellInfo,
      Columns
    },
    methods: {
      getRowKey (item) {
        return item.id
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
      },
      validatorAttrList () {
        if (!this.hasAttr) {
          return false
        }
        const errorAttr = this.attrList.find(attr => {
          if (attr.required) {
            const value = this.selectAttrMap[attr.id]
            if (!value || value.length <= 0) {
              return true
            }
          }
          return false
        })
        if (errorAttr) {
          return `售卖属性 ${errorAttr.name} 没有选择`
        }
        return false
      },
      async validatorTable () {
        const columns = this.$refs.columns.columns
        const descriptor = {}
        columns.forEach(col => {
          if (col.rules) {
            descriptor[col.id] = col.rules
          }
        })
        const validator = new Schema(descriptor)
        let error
        for (let i = 0; i < this.skuList.length; i++) {
          const sku = this.skuList[i]
          const errors = await new Promise((resolve) => {
            validator.validate(sku, (errors, fields) => {
              resolve(errors)
            })
          })
          if (errors && errors.length > 0) {
            error = errors[0].message
            return error
          }
        }
        return error
      },
      async validator () {
        const error = await this.$refs.sellInfo.validator()
        if (error) {
          return '请检查售卖信息内容'
        }
        return error
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
  }
</style>
