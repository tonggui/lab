<template>
  <table>
    <colgroup>
      <col v-for="(column, index) in columns" :key="index" :width="setCellWidth(column)" />
    </colgroup>
    <tbody class="table-body">
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <template v-for="(col, columnIndex) in columns">
          <table-td :key="columnIndex" :className="col.className" v-bind="getSpan(row, col, rowIndex, columnIndex)">
            <div :style="cellStyle(col)"><cell :row="row" :column="col" /></div>
          </table-td>
        </template>
      </tr>
    </tbody>
  </table>
</template>
