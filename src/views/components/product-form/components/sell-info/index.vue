<template>
  <div class="container">
    <div class="delete-alert" v-if="addable">
      重点提醒：删除规格将影响商品的历史销量，
      <a href="https://collegewm.meituan.com/sg/post/detail?id=236&contentType=0" target="_blank">点击查看具体规则</a>
    </div>
    <div v-if="addable && !hasAttr && !disabled" @click="handleAddSku">
      <span class="add">
        <Icon local="add-plus" size=16 />添加规格
      </span>
      <small class="helper-text">可添加商品规格，对应生成以下规格列表</small>
    </div>
    <Columns
      :hasAttr="hasAttr"
      :skuCount="value.length"
      :felidStatus="felidStatus"
      :disabled="disabled"
      :disabledExistSkuColumnMap="disabledExistSkuColumnMap"
      @on-delete="handleDeleteSku"
      @upc-blur="handleUpcBlur"
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
      disabledExistSkuColumnMap: {
        type: Object,
        default: () => ({})
      },
      felidStatus: Object,
      disabled: Boolean,
      addable: {
        type: Boolean,
        default: true
      },
      requiredPosition: {
        type: String,
        default: 'after',
        validator: (requiredPosition) => {
          return ['before', 'after'].includes(requiredPosition)
        }
      }
    },
    computed: {
      hasAttr () {
        return this.attrList && this.attrList.length > 0
      }
    },
    watch: {
      value (value) {
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
        // 当删除sku时，给出提示
        this.$Modal.confirm({
          title: '提示',
          content: '删除规格将影响商品的历史销量',
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
          let oldSelectedCount = this.getSelectedCount(oldSelectAttrMap)
          let newSelectedCount = this.getSelectedCount(selectAttrMap)
          if (newSelectedCount < oldSelectedCount) {
            this.handleAttrChange(attrList, selectAttrMap)
            // 当取消选中时给出提示
            this.$Modal.confirm({
              title: '提示',
              content: '删除规格将影响商品的历史销量',
              onCancel: () => {
                this.$nextTick(() => {
                  this.handleAttrChange(oldAttrList, oldSelectAttrMap)
                  setTimeout(() => {
                    this.handleChange(oldSkuList)
                  })
                })
              }
            })
            return
          }
        }
        this.handleAttrChange(attrList, selectAttrMap)
      },
      handleTableChange (skuList) {
        this.handleChange(skuList)
      },
      handleChange (skuList) {
        this.$emit('on-change', skuList)
      },
      handleAttrChange (attrList, selectAttrMap) {
        this.$emit('on-change-attr', attrList, selectAttrMap)
      },
      handleUpcBlur (sku, index) {
        this.$emit('upc-sug', sku, index)
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
    .delete-alert {
      color: @error-color;
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
