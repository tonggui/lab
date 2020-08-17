<template>
  <div class="container" @scroll="handleScroll" ref="table">
    <div class="table" :class="tableClass">
      <Head class="thead" :columns="columns" :required-position="requiredPosition" />
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
  import Head from './head'

  export default {
    name: 'descartes-pure-table',
    props: {
      columns: {
        type: Array,
        required: true
      },
      rowKey: Function,
      dataSource: Array,
      requiredPosition: String
    },
    components: {
      Row,
      Head
    },
    data () {
      return {
        fixedLeftScroll: false,
        fixedRightScroll: false
      }
    },
    computed: {
      tableClass () {
        return {
          'left-scroll': this.fixedLeftScroll,
          'right-scroll': this.fixedRightScroll
        }
      }
    },
    watch: {
      columns () {
        this.updateScrollStatus()
      }
    },
    methods: {
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
        const $rowList = this.$refs.row.sort((prev, next) => prev.index - next.index)
        for (let i = 0, l = $rowList.length; i < l; i++) {
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
      },
      handleScroll () {
        this.updateScrollStatus()
      },
      updateScrollStatus () {
        const $table = this.$refs.table
        if (!$table) {
          return
        }
        const $tableClientWidth = $table.clientWidth
        const $tableScrollWidth = $table.scrollWidth
        const scrollLeft = $table.scrollLeft
        this.fixedRightScroll = $tableScrollWidth - scrollLeft > $tableClientWidth
        this.fixedLeftScroll = scrollLeft > 0
      }
    },
    mounted () {
      this.updateScrollStatus()
    }
  }
</script>
<style lang="less">
  @import './fixed.less';
  .container .table {
    .fixed-table()
  }
</style>
<style lang="less" scoped>
  @import './fixed.less';
  .container {
    max-height: 360px;
    background: @component-bg;
    border: 1px solid @border-color-base;
    overflow: auto;
    .table {
      display: table;
      min-width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      background: @component-bg;
      position: relative;
    }
    .thead {
      position: sticky;
      top: 0;
    }
    .tbody {
      display: table-row-group;
    }
    .tip {
      margin-left: 4px;
    }
  }
</style>
