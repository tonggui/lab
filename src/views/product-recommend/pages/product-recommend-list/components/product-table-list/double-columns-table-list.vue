<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" v-if="tableDataSource.length">
      <template v-for="item in tableDataSource">
        <li v-if="showExisted(item.id)" :key="item.__id__" :class="{ 'disable': disableItem(item) }">
          <div v-if="disableItem(item)" class="disableMask" @click="handleClickItem(item)" />
          {{item.selected}}
          <Checkbox :value="item.selected" :disabled="disableItem(item)" class="item-checkout" @on-change="handleSelectChange($event, item)" />
          <ProductInfo :product="item" />
        </li>
      </template>
    </ul>
    <div></div>
  </div>
</template>

<script>
  import ProductInfo from '../product-info'
  // import _ from 'lodash'
  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      },
      maxSelected: {
        type: Number,
        default: 100
      },
      showExist: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        tableDataSource: [...this.dataSource]
      }
    },
    computed: {
      matchMaxSelected () {
        return !this.maxSelected
      }
    },
    components: {
      ProductInfo
    },
    watch: {
      maxSelected (val) {
        console.log('valmaxSelecteds', val, this.dataSource)
        // to-do 待优化
        // this.dataSource.forEach(item => {
        //   const idx = this.tableDataSource.findIndex(it => it.__id__ === item.__id__)
        //   const curTableItem = this.tableDataSource[idx]
        //   if (item.selected !== curTableItem.selected) {
        //     this.$set(this.tableDataSource, idx, { ...curTableItem, selected: item.selected })
        //   }
        // })
        // this.tableDataSource.splice(0, this.tableDataSource.length, ...this.dataSource)
        // this.tableDataSource = [...this.dataSource]
      }
      // dataSource: {
      //   deep: true,
      //   handler (val) {
      //     console.log('又来了')

      //     this.tableDataSource = [...val]
      //     this.$forceUpdate()
      //   }
      // }
    },
    methods: {
      disableItem (item) {
        return (this.matchMaxSelected && !item.selected) || !!item.id
      },
      showExisted (existed) {
        if (existed) return this.showExist
        else return true
      },
      handleClickItem (item) {
        if (!this.maxSelected) this.$emit('on-exceed-max', item)
      },
      getSelectedItems () {
        const items = []
        this.tableDataSource.forEach(item => {
          if (item.selected) items.push(item)
        })
        return items
      },
      handleSelectChange (selection, item) {
        console.log(item)
        console.table(this.tableDataSource)

        const idx = this.tableDataSource.findIndex(it => it.__id__ === item.__id__)
        console.log('idx', idx)
        this.$set(this.tableDataSource, idx, { ...item, selected: selection })
        console.table(this.tableDataSource)
        const selectedItems = this.getSelectedItems()
        // console.log()
        if (selection) this.$emit('on-select', [item], [...selectedItems])
        else this.$emit('on-de-select', [item], [...selectedItems])
      },
      handleSelectAll (selection) {
        let maxSelected = this.maxSelected
        const items = []
        for (let i = 0; i < this.tableDataSource.length; i++) {
          const cur = this.tableDataSource[i]
          if (maxSelected > 0 && selection && !cur.selected && !cur.id) {
            items.push(cur)
            this.$set(this.tableDataSource, i, { ...cur, selected: selection })
            maxSelected--
          } else if (!selection && cur.selected) {
            items.push(cur)
            this.$set(this.tableDataSource, i, { ...cur, selected: selection })
          }
        }
        return items
      },
      selectAll () {
        const items = this.handleSelectAll(true)
        const selectedItems = this.getSelectedItems()

        this.$emit('on-select', [...items], [...selectedItems])
      },
      deSelectAll () {
        const items = this.handleSelectAll(false)
        const selectedItems = this.getSelectedItems()

        this.$emit('on-de-select', [...items], [...selectedItems])
      }
    },
    updated () {
      console.log('update')
      console.table(this.tableDataSource)
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
        position: relative;
        &:nth-child(n) {
          border-right: 1px solid #F0F2F6;
        }
        .item-checkout {
          margin-top: 29px;
          margin-right: 12px;
        }
        &:hover {
          background: #FFF9F0;
        }
        .disableMask {
          background: transparent;
          z-index: 1;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          cursor: not-allowed;
        }
        &.disable {
          opacity: 0.5;
        }
      }
    }
  }
</style>
