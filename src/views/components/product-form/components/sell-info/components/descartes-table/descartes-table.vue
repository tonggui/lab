<template>
  <Table
    :rowKey="rowKey"
    :columns="allColumns"
    :dataSource="dataSource"
    @on-change="handleChange"
    ref="table"
  />
</template>
<script>
  import { isEmptyArray } from '@/common/utils'
  import Table from './table'

  const defaultKey = '$$$__default__$$$'
  const separator = '_'
  const KEY = Symbol('__descates_key__') // 唯一 key

  export default {
    name: 'descartes-table',
    props: {
      // 笛卡尔算子 二维数组
      dimvalue: {
        type: Array,
        default: () => []
      },
      // sku 列表
      value: {
        type: Array,
        default: () => []
      },
      // 固定的table列定义
      columns: {
        type: Array,
        required: true
      },
      // 笛卡尔结果存储字段
      keyName: {
        type: String,
        required: true
      },
      // 创建一个新的sku
      generateItem: {
        type: Function,
        default: () => ({})
      },
      parentKey: {
        type: String,
        default: 'parentId'
      }
    },
    data () {
      const valueMap = this.getValueMap(this.value)
      const descartesDataSource = this.getDescartesDataSource(this.dimvalue)
      const dataSource = this.getDataSource(valueMap, descartesDataSource)
      return {
        valueMap,
        descartesDataSource,
        dataSource
      }
    },
    watch: {
      value (newValue) {
        if (this.dataSource === newValue) {
          return
        }
        this.valueMap = this.getValueMap(newValue)
        this.dataSource = this.getDataSource(this.valueMap, this.descartesDataSource)
      },
      dimvalue (dimvalue) {
        this.descartesDataSource = this.getDescartesDataSource(dimvalue)
        this.dataSource = this.getDataSource(this.valueMap, this.descartesDataSource)
      }
    },
    computed: {
      allColumns () {
        const { keyName, parentKey } = this
        const columns = this.dimvalue.map(({ name, id }) => ({
          id,
          name,
          editable: false,
          align: 'center',
          render (h, { row }) {
            const list = row[keyName] || []
            const data = (list.find(i => i[parentKey] === id) || {}).name
            return <div>{ data }</div>
          }
        }))
        return [...columns, ...this.columns]
      }
    },
    components: {
      Table
    },
    methods: {
      getDataSource (valueMap, descartesDataSource) {
        const dataSource = descartesDataSource.map(item => {
          const value = valueMap[item[KEY]] || {}
          return {
            ...item,
            ...value
          }
        })
        this.handleChange(dataSource)
        return dataSource
      },
      getDescartesDataSource (dimvalue) {
        // 没有选择任何选项时
        if (isEmptyArray(dimvalue)) {
          // 获取默认的
          const item = this.getRowData()
          return [item]
        }
        return this.descartesRecursive([], 0)
      },
      getValueMap (value) {
        const data = {}
        value.forEach((item) => {
          const key = item[KEY] || this.getKey(item[this.keyName])
          data[key] = item
        })
        return data
      },
      getKey (list) {
        if (isEmptyArray(list)) {
          return defaultKey
        }
        return list.map(i => `${i[this.parentKey]}_$$_${i.name}`).sort().join(separator)
      },
      getRowData (list) {
        const key = this.getKey(list)
        const item = this.generateItem()
        return { ...item, [this.keyName]: [...(list || [])], [KEY]: key.toString() }
      },
      /**
       * 笛卡尔原理
       * [[a1, a2, a3], [b1, b2, b3]]
       * 递归做乘积
       * a1, a2, a3 ==> b1 ===> [a1, b1],[a2, b1], [a3, b1]
       * a1, a2, a3 ==> b2 ===> [a1, b2],[a2, b2], [a3, b2]
       * a1, a2, a3 ==> b3 ===> [a1, b3],[a2, b3], [a3, b3]
       */
      descartesRecursive (prefixList, index) {
        const size = this.dimvalue.length
        const currentDim = this.dimvalue[index]
        const { options: currentData } = currentDim
        // 递归出口
        if (index >= size - 1) {
          if (isEmptyArray(currentData)) {
            return [this.getRowData(prefixList)]
          }
          return currentData.map(item => {
            const newPrefixList = [...prefixList, item]
            return this.getRowData(newPrefixList)
          })
        }
        // 继续递归
        let result = []
        for (let i = 0, l = currentData.length; i < l; i++) {
          const item = currentData[i]
          const newPrefixs = [...prefixList, item]
          result = result.concat(this.descartesRecursive(newPrefixs, index + 1))
        }
        return result
      },
      rowKey (item) {
        return item[KEY]
      },
      handleChange (dataSource) {
        this.dataSource = dataSource
        this.$emit('on-change', dataSource)
      },
      validator () {
        return this.$refs.table.validator()
      }
    }
  }
</script>
