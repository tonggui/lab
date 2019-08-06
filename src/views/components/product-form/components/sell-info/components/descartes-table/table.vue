<template>
  <div class="container">
    <div class="table">
      <div class="thead">
        <div class="th" :class="{ required: isRequired(col) }" v-for="col in columns" :key="col.id" :style="{ textAlign: col.align || 'left' }">
          <span>{{ col.name }}</span>
          <span class="tip" v-if="col.tip">
            <Tooltip transfer :content="col.tip" max-width="300px" placement="top">
              <Icon type="help-outline" />
            </Tooltip>
          </span>
        </div>
      </div>
       <div class="tbody">
        <Row v-for="(row, index) in dataSource"
          class="tr"
          :key="getRowKey(row, index)"
          :columns="columns"
          :dataSource="row"
          :index="index"
          @on-change="handleChange"
          ref="row"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import Row from './row'

  export default {
    name: 'descartes-pure-table',
    props: {
      columns: {
        type: Array,
        required: true
      },
      rowKey: Function,
      dataSource: Array
    },
    components: {
      Row
    },
    methods: {
      isRequired (col) {
        if (col.required) {
          return true
        }
        if (col.rules) {
          return col.rules.some(i => i.required)
        }
        return false
      },
      getRowKey (row, index) {
        if (this.rowKey) {
          return this.rowKey(row, index)
        }
        return index
      },
      handleChange (value, index) {
        const list = [...this.dataSource]
        list.splice(index, 1, value)
        this.$emit('on-change', list)
      },
      async validator () {
        const $rowList = this.$refs.row
        for (let i = 0; i < $rowList.length; i++) {
          const needValidate = (this.dataSource[i] || {}).editable
          if (needValidate) {
            const $row = $rowList[i]
            if ($row && $row.validator) {
              const error = await $row.validator()
              if (error) {
                return error
              }
            }
          }
        }
        return false
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';
  .container {
    max-height: 360px;
    overflow: auto;
    background: @component-bg;
    border: 1px solid @border-color-base;
    .table {
      display: table;
      min-width: 100%;
      border-collapse: collapse;
      background: @component-bg;
    }
    .thead {
      display: table-row;
      .th {
        display: table-cell;
        height: 40px;
        line-height: 40px;
        padding: 0px 20px;
        vertical-align: middle;
        background: @table-thead-bg;
        color: @table-thead-color;
        border: 1px solid @border-color-base;
        border-top: none;
        white-space: nowrap;
        &:first-child {
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
        &.required::after {
          .required-chart()
        }
      }
    }
    .tbody {
      display: table-row-group;
    }
    .tip {
      margin-left: 4px;
    }
  }
</style>
