<template>
  <div :style="styles">
    <table cellspacing="0" cellpadding="0" border="0">
      <colgroup>
        <col v-for="(col, index) in columns" :key="index" :width="setHeadCellWidth(col, index)" />
      </colgroup>
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :key="index" :class="col.className">
            <div :style="getCellStyle(col)"><Header :column="col" :columnIndex="index" @on-select-all="handleSelectAll" /></div>
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>
<script>
  import Header from './header'

  export default {
    name: 'table-head',
    props: {
      styles: Object,
      columns: {
        type: Array,
        required: true
      },
      setHeadCellWidth: {
        type: Function,
        required: true
      },
      getCellStyle: {
        type: Function,
        required: true
      }
    },
    components: {
      Header
    },
    methods: {
      handleSelectAll (...reset) {
        this.$emit('on-select-all', ...reset)
      }
    }
  }
</script>
