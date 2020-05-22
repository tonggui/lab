<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list">
      <li v-for="item in tableDataSource" :key="item.key">
        <Checkbox :value="item.selected" :disabled="item.disabled" class="item-checkout" @on-change="handleSelectChange($event, item.key)" />
        <ProductInfo :product="item" />
      </li>
    </ul>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'
  import _ from 'lodash'
  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      }
    },
    data () {
      return {
        tableDataSource: _.cloneDeep(this.dataSource)
      }
    },
    components: {
      ProductInfo
    },
    watch: {
      dataSource (val) {
        this.tableDataSource = _.cloneDeep(this.dataSource)
      }
    },
    methods: {
      getSelectedKeys () {
        return this.tableDataSource.map(item => {
          if (item.selected) {
            return item.key
          }
        })
      },
      handleSelectChange (selection, key) {
        const keys = []
        this.tableDataSource.forEach(item => {
          if (item.key === key) item.selected = selection
          if (item.selected) keys.push(item.key)
        })
        this.$emit('on-select-change', [...keys])
      },
      handleSelectAll (selection) {
        this.tableDataSource.forEach(item => {
          item.selected = selection
        })
      },
      selectAll () {
        this.handleSelectAll(true)
        const keys = this.getSelectedKeys()
        this.$emit('on-select-change', [...keys])
      },
      deSelectAll () {
        this.handleSelectAll(false)
        this.$emit('on-select-change', [])
      }
    }
  }
</script>

<style lang="less" scoped>
  .double-columns-table-list-container {
    width: 100%;
    .double-columns-table-list {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      > li {
        width: 50%;
        height: 128px;
        border-bottom: 1px solid #F0F2F6;
        padding: 20px 29px 0 32px;
        display: flex;
        &:nth-child(n) {
          border-right: 1px solid #F0F2F6;
        }
        .item-checkout {
          margin-top: 29px;
          margin-right: 12px;
        }
      }
    }
  }
</style>
