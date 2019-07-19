<template>
  <Select :loading="loading" :value="value" @on-change="handleChange" @on-open-change="handleOpenChange" style="width:200px" filterable :remote="true" :remote-method="handleSearch">
    <Scroll :on-reach-bottom="hasEnd ? undefined : handleLoadMore" :distance-to-edge="20" :height="168">
      <div v-if="empty">
        <slot name="empty">
          <Empty>
            <Button type="primary" @click="getData">重新加载</Button>
          </Empty>
        </slot>
      </div>
      <!-- <div v-if="loading" class="loading"><Spin fix /></div> -->
      <Option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</Option>
    </Scroll>
  </Select>
</template>
<script>
  export default {
    name: 'slector-loadmore',
    props: {
      value: {
        type: [Number, String]
      },
      fetchData: {
        type: Function,
        required: true
      },
      pageSize: {
        type: Number,
        default: 20
      }
    },
    data () {
      return {
        loading: false,
        error: false,
        list: [],
        loadingNextPage: false,
        pagination: {
          pageSize: this.pageSize,
          current: 1,
          total: 0
        },
        keyword: ''
      }
    },
    computed: {
      empty () {
        return !this.loading && this.list.length <= 0
      },
      hasEnd () {
        return this.list.length >= this.pagination.total
      }
    },
    methods: {
      async getData () {
        try {
          this.loading = true
          const { list, pagination } = await this.fetchData(this.keyword, this.pagination)
          this.list = list
          this.pagination = pagination
          this.error = false
        } catch (err) {
          this.error = true
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async handleSearch (query) {
        this.pagination.current = 1
        this.keyword = query
        await this.getData()
      },
      async handleLoadMore () {
        if (this.loadingNextPage) {
          return
        }
        try {
          this.pagination.current += 1
          this.loadingNextPage = true
          const { list, pagination } = await this.fetchData(this.keyword, this.pagination)
          this.list.push.apply(this.list, list)
          this.pagination = pagination
          this.error = false
        } catch (err) {
          this.error = true
          this.$Message.error(err.message || err)
        } finally {
          this.loadingNextPage = false
        }
      },
      handleChange (v) {
        this.$emit('input', v)
      },
      handleOpenChange (status) {
        if (status && this.initialCreate) {
          this.getData()
          this.initialCreate = false
        }
      }
    },
    created () {
      this.initialCreate = true
    }
  }
</script>
<style lang="less" scoped>
  .container {
    max-height: 168px;
  }
  .loading {
    position: relative;
    height: 100px;
  }
</style>
