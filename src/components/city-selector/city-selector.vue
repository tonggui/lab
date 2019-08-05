<template>
  <Selector
    :fetchData="fetchData"
    :value="value"
    @on-change="handleChange"
    v-bind="$attrs"
  />
</template>
<script>
  import { fetchGetCityList } from '@/data/repos/common'
  import Selector from '@components/selector-loadmore'

  export default {
    name: 'city-selector',
    props: {
      value: [Number, String]
    },
    data () {
      return {
        keyword: '',
        filterList: [],
        list: []
      }
    },
    components: {
      Selector
    },
    methods: {
      handleChange (v) {
        this.$emit('on-change', v)
        this.$emit('input', v)
      },
      updateFilterList (keyword) {
        if (keyword !== this.keyword) {
          this.keyword = keyword
          if (!keyword) {
            this.filterList = this.list.slice()
          } else {
            this.filterList = this.list.filter(({ name }) => name.inclues(this.keyword))
          }
        }
      },
      async fetchData (keyword, pagination) {
        if (this.list.length <= 0) {
          await this.getData()
        }
        this.updateFilterList(keyword)
        const currentData = this.getNextPageData(this.filterList, pagination)
        return {
          list: currentData,
          pagination: {
            ...pagination,
            total: this.filterList.length
          }
        }
      },
      getNextPageData (list, { pageSize, current }) {
        const start = pageSize * (current - 1)
        const end = pageSize * current
        return list.slice(start, end)
      },
      async getData () {
        let list = []
        try {
          list = await fetchGetCityList()
        } catch (err) {}
        this.list = list
        this.filterList = list.slice()
      }
    }
  }
</script>
