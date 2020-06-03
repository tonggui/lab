<template>
  <table :style="styles" cellspacing="0" cellpadding="0" border="0">
    <colgroup>
      <col v-for="(col, index) in columns" :key="index" :width="setCellWidth(col, index)" />
    </colgroup>
    <template v-for="product in data">
      <tbody :key="rowKey(product)">
        <tr v-for="(sku, skuIndex) in product.skuList" :key="skuIndex">
          <template v-for="(col, columnIndex) in columns">
            <TableTd :key="columnIndex" :className="col.className" v-bind="getSpan(product, col, skuIndex, columnIndex)">
              <div :style="getCellStyle(col)">
                <SelectionCell v-if="col.type === 'selection'" :row="getRow(product, skuIndex)" :rowKey="rowKey" :rowSelection="col" @on-select="handleSelect" />
                <Cell v-else :row="getRow(product, skuIndex)" :column="col" :sku-index="skuIndex" :column-index="columnIndex" />
              </div>
            </TableTd>
          </template>
        </tr>
      </tbody>
      <slot name="row-bottom" :row="product"></slot>
    </template>
  </table>
</template>
<script>
  import SelectionCell from './selection-cell'
  import Cell from './cell'
  import TableTd from './td'

  export default {
    name: 'table-body',
    props: {
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        required: true
      },
      styles: Object,
      setCellWidth: {
        type: Function,
        required: true
      },
      getSpan: {
        type: Function,
        required: true
      },
      getCellStyle: {
        type: Function,
        required: true
      },
      getRow: {
        type: Function,
        required: true
      },
      rowKey: {
        type: Function,
        required: true
      },
      rowSelection: Object
    },
    components: {
      SelectionCell,
      Cell,
      TableTd
    },
    methods: {
      handleSelect (...reset) {
        this.$emit('on-select', ...reset)
      }
    }
  }
</script>
