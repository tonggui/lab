<template>
  <scroll-selector
    :value="value"
    remote
    clearable
    filterable
    :loading="loading"
    not-found-text="暂无数据"
    :remote-method="handleSearch"
    @on-change="handleChange"
    @on-open-change="handleOpenChange"
  >
    <Option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</Option>
  </scroll-selector>
  <!-- <Select :value="value" @on-change="handleChange" @on-open-change="handleOpenChange" style="width:200px" filterable :remote="true" :remote-method="handleSearch">
    <Scroll :on-reach-bottom="hasEnd ? undefined : handleLoadMore" :distance-to-edge="20" :height="168">
      <div v-if="empty">
        <slot name="empty">
          <Empty>
            <Button type="primary" @click="getData">重新加载</Button>
          </Empty>
        </slot>
      </div>
      <div v-if="loading" class="loading"><Spin fix /></div>
      <Option v-for="item in list" :key="item.id" :value="item.id">{{ item.name }}</Option>
    </Scroll>
  </Select> -->
</template>
<script>
  import ScrollSelector from '@sfe/bootes/src/business/scroll-selector'

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
        // loadingNextPage: false,
        pagination: {
          pageSize: this.pageSize,
          current: 1,
          total: 0
        },
        keyword: ''
      }
    },
    components: { ScrollSelector },
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
          this.$nextTick(() => {
            this.loading = false
          })
        }
      },
      async handleSearch (query, current) {
        current = current || 1
        this.pagination.current = current
        this.keyword = query
        let list = []
        try {
          this.loading = true
          const data = await this.fetchData(this.keyword, this.pagination)
          list = data.list
          if (current === 1) {
            this.list = list
          } else {
            this.list = [...this.list, ...list]
          }
        } catch (err) {} finally {
          this.loading = false
        }
        return this.list
      },
      // async handleLoadMore () {
      //   if (this.loadingNextPage) {
      //     return
      //   }
      //   try {
      //     this.pagination.current += 1
      //     this.loadingNextPage = true
      //     const { list, pagination } = await this.fetchData(this.keyword, this.pagination)
      //     this.list.push.apply(this.list, list)
      //     this.pagination = pagination
      //     this.error = false
      //   } catch (err) {
      //     this.error = true
      //     this.$Message.error(err.message || err)
      //   } finally {
      //     this.loadingNextPage = false
      //   }
      // },
      handleChange (v) {
        this.$emit('on-change', v)
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
