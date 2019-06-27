<template>
  <CategoryTree
    :value="value"
    :expand-list="expandList"
    :loading="loading"
    :dataSource="dataSource"
    @change="handleChange"
    @open="handleOpen"
  >
  </CategoryTree>
</template>
<script>
import CategoryTree from '@components/category-tree'
import { fetchGetPoiTagInfo } from '@/data/repos/category'

const allData = {
  name: '全部',
  id: 0,
  productCount: 0,
  isLeaf: true
}

export default {
  name: 'tag-list',
  props: ['value', 'expandList'],
  data: function () {
    return {
      loading: false,
      dataSource: [],
      topLimit: 0,
      smartSortSwitch: false
    }
  },
  components: {
    CategoryTree
  },
  methods: {
    handleChange (id) {
      this.$emit('change', id)
    },
    handleOpen (idList) {
      this.$emit('open', idList)
    },
    async getData () {
      this.loading = true
      const { tagList, tagInfo } = await fetchGetPoiTagInfo()
      const { smartSortSwitch, topLimit, productTotal } = tagInfo
      const all = {
        ...allData,
        productCount: productTotal || 0
      }
      this.dataSource = [all, ...tagList]
      this.topLimit = topLimit || 0
      this.smartSortSwitch = smartSortSwitch || false
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style></style>
