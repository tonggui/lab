<template>
  <div class="container">
    <div class="delete-alert" v-if="addable">
      重点提醒：删除规格将影响商品的历史销量，
      <a href="https://collegewm.meituan.com/sg/post/detail?id=236&contentType=0" target="_blank">点击查看具体规则</a>
    </div>
    <div v-if="showAdd && addPosition === 'top'" class="add-container">
      <span class="add" @click="handleAddSku">
        <Icon type="add" size=12 />添加规格
      </span>
      <small class="helper-text">可添加商品规格，对应生成以下规格列表</small>
    </div>
    <Columns
      :hasAttr="hasAttr"
      :skuCount="value.length"
      :fieldStatus="fieldStatus"
      :disabled="disabled"
      need-permission
      :disabledExistSkuColumnMap="disabledExistSkuColumnMap"
      :extra-column-config="columnConfig"
      @on-delete="handleDeleteSku"
      @upc-blur="handleUpcBlur"
      @on-noUpc-change="handleNoUpcChange"
    >
      <template v-slot:default="{columns}">
        <SellInfo
          :required-position="requiredPosition"
          :options="attrList"
          :value="selectAttrMap"
          :dataSource="value"
          :rowKey="getRowKey"
          :columns="columns"
          :disabled="disabled"
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
    <div v-if="showAdd && addPosition === 'bottom'" class="add-container">
      <span class="add" @click="handleAddSku">
        <Icon type="add" size=12 />添加规格
      </span>
      <!-- <small class="helper-text">可添加商品规格，对应生成以下规格列表</small> -->
    </div>
  </div>
</template>
<script>
  import SellInfo from './sell-info'
  import Columns from './columns'
  import {
    createSku,
    createAttrValue
  } from '@/data/helper/product/operation'
  import { differenceWith, isEqual, find } from 'lodash'

  export default {
    name: 'product-sell-info-container',
    props: {
      attrList: Array,
      selectAttrMap: Object,
      value: Array,
      disabledExistSkuColumnMap: {
        type: Object,
        default: () => ({})
      },
      fieldStatus: Object,
      disabled: Boolean,
      addable: {
        type: Boolean,
        default: true
      },
      addPosition: {
        type: String,
        default: 'top',
        validator: (addPosition) => {
          return ['top', 'bottom'].includes(addPosition)
        }
      },
      requiredPosition: {
        type: String,
        default: 'after',
        validator: (requiredPosition) => {
          return ['before', 'after'].includes(requiredPosition)
        }
      },
      columnConfig: Object
    },
    data: function () {
      return {
        originSkuList: {
          type: Array,
          default: () => ([])
        }
      }
    },
    computed: {
      hasAttr () {
        return this.attrList && this.attrList.length > 0
      },
      showAdd () {
        return this.addable && !this.hasAttr && !this.disabled
      }
    },
    watch: {
      value () {
        if (!this.hasAttr && (!this.value || this.value.length <= 0)) {
          this.handleAddSku()
        }
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
        this.handleChange(skuList)
      },
      handleDeleteSku (index) {
        // 删除参与组包商品的规格
        const str = this.value[index].relCombinationProduct ? '删除规格将影响商品的历史销量。商品规格修改后所关联的组包商品将会自动删除，确认是否修改），确认修改后所关联的组包商品自动删除' : '删除规格将影响商品的历史销量'
        // 当删除sku时，给出提示
        this.$Modal.confirm({
          title: '提示',
          content: str,
          onOk: () => {
            const skuList = [...this.value]
            skuList.splice(index, 1)
            this.handleChange(skuList)
          }
        })
      },
      // 获取当前选中项的总数
      getSelectedCount (selectAttrMap) {
        let selectedCount = 0
        Object.keys(selectAttrMap).forEach(k => {
          selectedCount += (selectAttrMap[k] || []).length
        })
        return selectedCount
      },
      handleOptionChange (attrList, selectAttrMap) {
        // 选中项数发生变化时
        if (this.selectAttrMap !== selectAttrMap) {
          const oldSelectAttrMap = this.selectAttrMap
          const oldAttrList = this.attrList
          const oldSkuList = this.value
          const oldSelectedCount = this.getSelectedCount(oldSelectAttrMap)
          const newSelectedCount = this.getSelectedCount(selectAttrMap)
          if (newSelectedCount < oldSelectedCount) {
            this.handleAttrChange(attrList, selectAttrMap)
            setTimeout(() => {
              // setTimeout获取this.value为最新值
              const diffSkuList = differenceWith(oldSkuList, this.value, isEqual)
              console.log(diffSkuList)
              // sku会变化时
              const result = diffSkuList.length > 0 && diffSkuList.some((item, index) => {
                return !!item.relCombinationProduct
              })
              const str = result ? '删除规格将影响商品的历史销量。商品规格修改后所关联的组包商品将会自动删除，确认是否修改），确认修改后所关联的组包商品自动删除' : '删除规格将影响商品的历史销量'
              // 当取消选中时给出提示
              this.$Modal.confirm({
                title: '提示',
                content: str,
                onCancel: () => {
                  this.$nextTick(() => {
                    this.handleAttrChange(oldAttrList, oldSelectAttrMap)
                    setTimeout(() => {
                      this.handleChange(oldSkuList)
                    })
                  })
                }
              })
            })
          }
        }
        this.handleAttrChange(attrList, selectAttrMap)
      },
      handleTableChange (skuList, index) {
        this.handleChange(skuList, index)
      },
      handleChange (skuList, index = -1) {
        // 是否售卖 - sku会变化
        if (index > -1) {
          const result = !skuList[index].editable && !!skuList[index].relCombinationProduct
          if (result) {
            this.$Modal.confirm({
              title: '提示',
              content: '删除规格将影响商品的历史销量。商品规格修改后所关联的组包商品将会自动删除，确认是否修改），确认修改后所关联的组包商品自动删除'
            })
          }
        }
        this.$emit('on-change', skuList)
      },
      handleAttrChange (attrList, selectAttrMap) {
        this.$emit('on-change-attr', attrList, selectAttrMap)
      },
      handleUpcBlur (sku, index) {
        // 新添加规格是没有生成skuid的，判断relCombinationProduct没有影响
        if (sku.id) {
          const target = find(this.originSkuList, ['id', sku.id])
          const result = (sku.upcCode !== target.upcCode) && !!sku.relCombinationProduct
          if (result) {
            this.$Modal.confirm({
              title: '提示',
              content: '商品规格修改后所关联的组包商品将会自动删除，确认是否修改），确认修改后所关联的组包商品自动删除'
            })
          }
        }
        this.$emit('upc-sug', sku, index)
      },
      handleNoUpcChange (data, index) {
        const skuList = this.value
        skuList.splice(index, 1, data)
        this.$emit('on-change', skuList)
      },
      async validate () {
        const result = await this.$refs.sellInfo.validator()
        if (result) throw new Error(result)
      }
    },
    mounted () {
      this.originSkuList = this.value
      if (!this.value || this.value.length <= 0) {
        this.handleAddSku()
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    background: @component-bg;
    .delete-alert {
      color: @error-color;
      line-height: 36px;
      a {
        text-decoration: underline;
      }
    }
    .add-container {
      line-height: 36px;
    }
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
