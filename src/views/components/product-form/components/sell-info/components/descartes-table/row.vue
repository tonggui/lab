<template>
  <Form class="row" :model="dataSource" ref="form">
    <template v-for="col in columns">
      <div class="cell" :key="col.id.toString()" :style="getStyles(col)">
        <FormItem v-if="editable(col)" :prop="col.id.toString()" :rules="col.rules">
          <Cell :col="col" :data="dataSource" :index="index" @on-change="handleChange" />
        </FormItem>
        <Cell v-else :col="col" :data="dataSource" :index="index" />
      </div>
    </template>
  </Form>
</template>
<script>
  import Cell from './cell'
  import { isNumber, isString } from 'lodash'

  export default {
    name: 'descartes-table-row',
    props: {
      columns: {
        type: Array,
        required: true
      },
      dataSource: {
        type: Object,
        required: true
      },
      index: [Number, String]
    },
    components: {
      Cell
    },
    methods: {
      getStyles (col) {
        const styles = { textAlign: col.align || 'left' }
        if (isNumber(col.width)) {
          styles.minWidth = `${col.width}px`
        } else if (isString(col.width)) {
          styles.minWidth = col.width
        }
        return styles
      },
      editable (col) {
        const { editable = true } = col
        return editable
      },
      handleChange (data) {
        this.$emit('on-change', data, this.index)
      },
      async validator () {
        const error = await new Promise((resolve) => {
          this.$refs.form.validate((valid) => {
            // 外头感受是否出错，返回的valid是是否不出错，所以取反
            resolve(!valid)
          })
        })
        return error
      }
    }
  }
</script>
<style lang="less" scoped>
  .row {
    display: table-row;
    &:hover {
      background: @table-row-hover-bg;
    }
    /deep/ .boo-form-item-content {
      font-size: inherit;
    }
    /deep/ .boo-form-item-error {
      .boo-input-number[disabled],
      .boo-input[disabled] {
        border-color: @disabled-border-color;
      }
    }
    /deep/ .boo-form-item-error-tip {
      display: none;
    }
    &:last-child .cell {
      border-bottom: none;
    }
    .cell {
      display: table-cell;
      height: 60px;
      line-height: 60px;
      padding: 0 20px;
      text-align: left;
      white-space: nowrap;
      vertical-align: middle;
      border: 1px solid @border-color-base;
      color: @text-color;
      &:first-child {
        border-left: none;
      }
      &:last-child {
        border-right: none;
      }
      /deep/ .boo-form-item {
        margin: 0;
        vertical-align: middle;
      }
    }
  }
</style>
