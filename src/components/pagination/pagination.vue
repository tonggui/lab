<!-- TODO page bug fix -->
<template>
  <Page
    v-bind="page"
    @on-change="handlePageChange"
    @on-page-size-change="handlePageSizeChange"
  />
</template>
<script>
  export default {
    name: 'pagination',
    props: {
      pagination: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        pageSize: this.pagination.pageSize
      }
    },
    computed: {
      page () {
        return {
          pageSizeOpts: [20, 50, 100],
          ...this.$attrs,
          ...this.pagination
        }
      }
    },
    watch: {
      pagination (newValue) {
        if (newValue.pageSize !== this.pageSize) {
          this.pageSize = newValue.pageSize
        }
      }
    },
    methods: {
      handlePageChange (current) {
        this.$emit('on-change', { ...this.pagination, pageSize: this.pageSize, current })
      },
      handlePageSizeChange (pageSize) {
        // TODO page bug fix
        if (this.pagination.current === 1) {
          this.$emit('on-change', { ...this.pagination, pageSize, current: 1 })
        } else {
          this.pageSize = pageSize
        }
      }
    }
  }
</script>
