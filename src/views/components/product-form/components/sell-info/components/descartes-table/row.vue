<template>
  <Form class="row" :model="dataSource" ref="form">
    <template v-for="col in columns">
      <div class="cell" :key="col.id" :style="getStyles(col)" :class="fixClass(col)" :ref="col.id">
        <FormItem v-if="editable(col)" :prop="col.id" :rules="col.rules">
          <Cell :col="col" :data="dataSource" :index="index" @on-change="handleChange" />
        </FormItem>
        <Cell v-else :col="col" :data="dataSource" :index="index" />
      </div>
    </template>
  </Form>
</template>
<script>
  import Cell from './cell'
  import { isNumber, isString, get } from 'lodash'
  import fixedMixins from './fixed-mixins'

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
    mixins: [fixedMixins],
    methods: {
      getStyles (col) {
        const styles = { textAlign: col.align || 'left' }
        if (isNumber(col.width)) {
          styles.minWidth = `${col.width}px`
        } else if (isString(col.width)) {
          styles.minWidth = col.width
        }
        const fixStyles = this.fixStyles(col)
        return { ...styles, ...fixStyles }
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
            const $col = get(this.$refs, `[${col.id}][0]`)
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
  @import './fixed.less';
  .row {
    display: table-row;
    position: relative;
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
      line-height: 60px;
      padding: 10px 20px;
      text-align: left;
      white-space: nowrap;
      vertical-align: middle;
      border-bottom: 1px solid @border-color-base;
      border-right: 1px solid @border-color-base;
      color: @text-color;
      background: #fff;
      &:last-child {
        border-right: none;
      }
      /deep/ .boo-form-item {
        margin: 0;
        vertical-align: middle;
      }
      .fixed-cell()
    }
  }
</style>
