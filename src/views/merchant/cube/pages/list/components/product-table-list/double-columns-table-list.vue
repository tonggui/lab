<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list" v-if="tableDataSource.length">
      <template v-for="item in tableDataSource">
        <li v-if="showExisted(item.id)" :key="item.__id__" :class="{ 'disable': disableItem(item) }">
          <div v-if="disableItem(item)" class="disableMask" @click="handleClickItem(item)" />
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
        this.tableDataSource = [...this.dataSource]
      },
      dataSource: {
        immediate: true,
        deep: true,
        handler (val) {
          this.tableDataSource = [...val]
          this.$forceUpdate()
        }
      }
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
        const idx = this.tableDataSource.findIndex(it => it.__id__ === item.__id__)
        this.$set(this.tableDataSource, idx, { ...item, selected: selection })
        item.selected = selection
        const selectedItems = this.getSelectedItems()
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
      min-height: 128px;
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
        background: #fff;
        opacity: 0.5;
        z-index: 1;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        cursor: not-allowed;
      }
      &.disable {
        // opacity: 0.5;
      }
    }
  }
}
</style>
