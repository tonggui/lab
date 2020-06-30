<template>
  <Form class="row" :model="dataSource" ref="form">
    <template v-for="col in columns">
      <div class="cell" :key="col.id" :style="getStyles(col)">
        <FormItem v-if="editable(col)" :prop="col.id" :rules="col.rules" ref="col">
          <Cell :col="col" :data="dataSource" :index="index" @on-change="handleChange" />
        </FormItem>
        <Cell v-else :col="col" :data="dataSource" :index="index" ref="col" />
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
      validateField (col) {
        if (!this.editable(col)) {
          return
        }
        return new Promise(resolve => {
          this.$refs.form.validateField(col.id, resolve)
        })
      },
      async validator () {
        for (let i = 0; i < this.columns.length; i++) {
          const col = this.columns[i]
          const error = await this.validateField(col)
          if (error) {
            const $col = this.$refs.col && this.$refs.col[i] && this.$refs.col[i].$el
            $col && $col.scrollIntoViewIfNeeded && $col.scrollIntoViewIfNeeded()
            return error
          }
        }
        return false
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
