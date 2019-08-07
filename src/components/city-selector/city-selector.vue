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
      async updateFilterList (keyword) {
        if (keyword !== this.keyword) {
          this.keyword = keyword
          if (!keyword) {
            this.filterList = this.list.slice()
          } else {
            const step = 1000
            const size = this.list.length
            let result = []
            await new Promise((resolve) => {
              let pageNum = 0
              while (pageNum * step < size) {
                const temp = this.list.slice(pageNum * step, (pageNum + 1) * step)
                const data = temp.filter(({ name }) => name.includes(keyword))
                result = [...result, ...data]
                pageNum += 1
              }
              resolve()
            })
            this.filterList = result
          }
        }
      },
      async fetchData (keyword, pagination) {
        if (this.list.length <= 0) {
          await this.getData()
        }
        await this.updateFilterList(keyword)
        const page = {
          ...pagination,
          total: this.filterList.length
        }
        const currentData = this.getNextPageData(this.filterList, page)
        return {
          list: currentData,
          pagination: page
        }
      },
      getNextPageData (list, { pageSize, current, total }) {
        const start = pageSize * (current - 1)
        const end = pageSize * current
        if (start >= total) {
          return []
        }
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
