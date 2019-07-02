<template>
  <TagTree
    :value="tagId"
    :expand-list="expandList"
    :loading="loading"
    :dataSource="dataSource"
    @select="handleSelect"
    @expand="handleExpand"
  >
    <template v-slot:node-extra="{item}">
      <div v-if="isShowSetting(item)" class="setting">
        <Icon type="settings" size="20" />
      </div>
    </template>
  </TagTree>
</template>
<script>
import TagTree from '@components/tag-tree'
import { fetchGetPoiTagInfo } from '@/data/repos/category'
import { allProduct } from '@/data/constants/poi'
import state from '../../../../store'

export default {
  name: 'tag-list',
  props: {
    tagId: {
      type: Number,
      default: allProduct.id
    }
  },
  data: function () {
    return {
      loading: false,
      error: false,
      dataSource: [],
      expandList: [],
      topLimit: 0,
      smartSortSwitch: false
    }
  },
  components: {
    TagTree
  },
  methods: {
    isShowSetting (item) {
      return item.id !== allProduct.id
    },
    handleSelect (id) {
      this.$emit('change', id)
    },
    handleExpand (idList) {
      this.expandList = idList
    },
    async getData () {
      this.loading = true
      try {
        const { tagList, tagInfo } = await fetchGetPoiTagInfo()
        const { smartSortSwitch, topLimit, productTotal } = tagInfo
        // TODO
        state.productCount = productTotal
        state.smartSortSwitch = smartSortSwitch
        const all = {
          ...allProduct,
          productCount: state.productCount
        }
        this.dataSource = [all, ...tagList]
        this.topLimit = topLimit
        this.smartSortSwitch = smartSortSwitch
        this.error = false
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
.setting {
  color: @text-color-secondary;
}
</style>
