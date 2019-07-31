<template>
  <div class="container">
    <AttrList v-if="!!dimvalue"
      :dataSource="options"
      :value="value"
      @on-change="handleOptionsChange"
      :valueKey="optionValueKey"
      errorTips="请选择s%属性"
      :generateItem="generateOption"
      ref="options"
    />
    <div :class="{ offset: dimvalue }" class="table">
      <small v-if="!!nameGroup" class="helper-text">根据<span>{{ nameGroup }}</span>生成以下列表</small>
      <Table
        :dimvalue="dimvalue"
        :value="dataSource"
        :keyName="descartesKey"
        :columns="columns"
        :rowKey="rowKey"
        :generateItem="generateItem"
        @on-change="handleTableChange"
        ref="table"
      />
    </div>
  </div>
</template>
<script>
  import AttrList from './components/attr-list'
  import Table from './components/descartes-table'

  export default {
    name: 'product-sell-info',
    props: {
      // 属性列表
      options: {
        type: Array,
        default: () => []
      },
      // 属性选择值map
      value: {
        type: Object,
        default: () => ({})
      },
      // sku 列表
      dataSource: {
        type: Array,
        default: () => []
      },
      // 列信息
      columns: {
        type: Array,
        required: true
      },
      // 属性key的字段
      optionValueKey: {
        type: String,
        default: 'id'
      },
      // 创建sku
      generateItem: Function,
      // 创建 option
      generateOption: Function,
      // 笛卡尔信息存储
      descartesKey: {
        type: String,
        required: true
      },
      rowKey: Function
    },
    computed: {
      nameGroup () {
        if (!this.dimvalue) {
          return ''
        }
        return this.dimvalue.map(n => n.name).join('、')
      },
      dimvalue () {
        if (this.options.length <= 0) {
          return false
        }
        const result = []
        this.options.forEach(node => {
          const { options: list, ...rest } = node
          const value = this.value[node.id]
          if (value) {
            const item = rest
            item.options = list.filter(i => value.includes(i[this.optionValueKey]))
            result.push(item)
          }
        })
        return result
      }
    },
    components: {
      AttrList,
      Table
    },
    methods: {
      handleOptionsChange (options, value) {
        this.$emit('on-option-change', options, value)
      },
      handleTableChange (dataSource) {
        this.$emit('on-table-change', dataSource)
      },
      async validator () {
        const $options = this.$refs.options
        const $table = this.$refs.table
        // 属性校验
        if ($options && $options.validator) {
          const error = await $options.validator()
          if (error) {
            return error
          }
        }
        if ($table && $table.validator) {
          const error = await $table.validator()
          if (error) {
            if (typeof error !== 'string') {
              return '请检查售卖信息'
            }
            return error
          }
        }
        return false
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    background: @component-bg;
    .table {
      margin-top: 10px;
    }
    .offset {
      width: 100%;
      box-sizing: border-box;
      padding-left: 60px;
      overflow: hidden;
    }
  }
</style>
