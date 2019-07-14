<template>
  <Table
    :dataSource="dataSource"
    :loading="loading"
    :pagination="pagination"
    @page-change="$listeners['page-change']"
    :columns="columns"
    :draggable="true"
    @on-drag-drop="handleDragDrop"
  />
</template>
<script>
  import Table from '@components/product-list-table'
  import columns from './columns'

  export default {
    name: 'drag-sort-product-list',
    props: {
      dataSource: Array,
      pagination: Object,
      loading: Boolean
    },
    components: {
      Table
    },
    computed: {
      columns () {
        const _slef = this
        return [...columns, {
          width: 200,
          render (h, { row, index }) {
            const { pageSize, current } = _slef.pagination
            const no = pageSize * (current - 1) + index + 1
            return (
              <div class="drag-sort-list-input">
                排序<Input value={no} size="small" />
              </div>
            )
          }
        }, {
          width: 100,
          render (h) {
            return (
              <div class="drag-sort-list-op">
                <span class="drag-sort-list-icon">
                  <Icon type="unfold-more" size="14" />
                </span>
                <span>拖拽</span>
              </div>
            )
          }
        }]
      }
    },
    methods: {
      handleDragDrop (index1, index2) {
        console.log('index1, index2:', index1, index2)
        if (index1 !== index2) {
          const list = [...this.dataSource]
          const node = list[index1]
          list[index1] = list[index2]
          list[index2] = node
          this.$emit('change-list', list)
        }
      }
    }
  }
</script>
<style lang="less">
.drag-sort-list {
  &-input {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    input {
      width: 60px;
      margin-left: 10px;
    }
  }
  &-op {
    color: @highlight-color;
    line-height: 1px;
    cursor: move;
  }
  &-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 6px;
    border: 1px solid rgba(248,152,0,0.30);
    border-radius: 100%;
    text-align: center;
    i {
      transform: scale(.8);
    }
  }
}
</style>
