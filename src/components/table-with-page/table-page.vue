<template>
  <div class="table-with-page" ref="container">
    <slot name="header"></slot>
    <Table
      :columns="columns"
      :data="data"
      v-on="listeners"
      v-bind="$attrs"
      class="table-with-page-table"
      ref="table"
      v-show="!isEmpty"
    >
    </Table>
    <Page
      v-if="showPagination"
      v-bind="page"
      @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange"
      class="table-with-page-page"
    />
    <slot name="empty" v-show="isEmpty" />
    <Loading :loading="loading" />
  </div>
</template>
<script>
  import Loading from '@components/loading'
  import { getScrollElement } from '@/common/domUtils'

  export default {
    name: 'table-with-page',
    props: {
      loading: Boolean,
      columns: {
        type: Array,
        required: true
      },
      data: {
        type: Array,
        default: () => []
      },
      pagination: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        pageSize: this.pagination.pageSize // TODO page bug fix
      }
    },
    computed: {
      listeners () {
        const { change, ...rest } = this.$listeners
        return rest
      },
      page () {
        return {
          pageSizeOpts: [20, 50, 100],
          ...this.pagination
        }
      },
      isEmpty () {
        return !this.loading && this.data.length <= 0
      },
      showPagination () {
        return !!this.pagination && this.data.length > 0
      }
    },
    watch: {
      loading (loading) {
        if (loading) {
          // 数据切换时更新滚动条位置
          const { top } = this.$refs.container.getBoundingClientRect()
          const $scrollingElement = getScrollElement()
          const scrollTop = $scrollingElement.scrollTop
          if (scrollTop > top) {
            $scrollingElement.scrollTop += top
          }
        }
      },
      pagination (newValue) {
        if (newValue.pageSize !== this.pageSize) {
          this.pageSize = newValue.pageSize
        }
      }
    },
    components: {
      Loading
    },
    methods: {
      handlePageChange (current) {
        this.$emit('on-page-change', { ...this.pagination, pageSize: this.pageSize, current })
      },
      handlePageSizeChange (pageSize) {
        // TODO page bug fix
        if (this.pagination.current === 1) {
          this.$emit('on-page-change', { ...this.pagination, pageSize, current: 1 })
        } else {
          this.pageSize = pageSize
        }
      }
    }
  }
</script>
<style lang="less">
  .table-with-page {
    position: relative;
    height: 100%;
    &-table {
      border: none;
    }
    &-page {
      text-align: right;
      padding: 30px 20px;
    }
  }
</style>
