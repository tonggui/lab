<template>
  <div class="thead">
    <div class="th" v-for="col in columns" :key="col.id" :style="getStyles(col)" :class="fixClass(col)" ref="col">
      <span :class="{ required: isRequired(col), [`required-${requiredPosition}`]: true }">{{ col.name }}</span>
      <span class="tip" v-if="col.tip">
        <Tooltip transfer :content="col.tip" max-width="300px" placement="top">
          <Icon type="help-outline" />
        </Tooltip>
      </span>
    </div>
  </div>
</template>
<script>
  import fixedMixins from './fixed-mixins'

  export default {
    name: 'descartes-pure-table-head',
    props: {
      columns: {
        type: Array,
        required: true
      },
      requiredPosition: String
    },
    mixins: [fixedMixins],
    methods: {
      getStyles (col) {
        const styles = { textAlign: col.align || 'left' }
        const fixStyles = this.fixStyles(col)
        return { ...styles, ...fixStyles }
      },
      isRequired (col) {
        if (col.required) {
          return true
        }
        if (col.rules) {
          return col.rules.some(i => i.required)
        }
        return false
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~@/styles/common.less';
  @import './fixed.less';
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
      border-bottom: 1px solid @border-color-base;
      border-right: 1px solid @border-color-base;
      border-top: none;
      white-space: nowrap;
      &:last-child {
        border-right: none;
      }
      .fixed-cell()
    }
    .required {
      display: inline-block;
      &.required-after::after,
      &.required-before::before {
        .required-chart();
        vertical-align: baseline;
      }
    }
  }
</style>
