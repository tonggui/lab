<template>
  <Form class="row" :model="dataSource" ref="form">
    <template v-for="col in columns">
      <div class="cell" :key="col.id" :style="{ textAlign: col.align || 'left' }">
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
      padding: 0 10px;
      text-align: center;
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
