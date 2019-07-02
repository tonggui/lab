<template>
  <div class="tag-list-container">
    <div class="tag-list-header">
      <template v-if="!sorting">
        <Button>
          <Icon type="add"></Icon>
          新建分类
        </Button>
        <Button @click="handleSort">
          <Icon type="swap-vert"></Icon>
          管理排序
        </Button>
      </template>
      <template v-else>
        <span v-if="isMedicine">商品/分类排序</span>
        <template v-else>
          <span>分类智能排序</span>
          <iSwitch :value="smartSortSwitch" @on-change="handleOpenSmartSort" />
        </template>
      </template>
    </div>
    <TagTree
      :value="tagId"
      :expand-list="expandList"
      :loading="loading"
      :dataSource="dataSource"
      @select="handleSelect"
      @expand="handleExpand"
      class="tag-list"
    >
      <template v-slot:node-extra="{item}">
        <div v-if="isShowSetting(item)" class="setting">
          <Icon type="settings" size="20" />
        </div>
      </template>
    </TagTree>
    <div class="tag-list-footer">
      <Button>
        <Icon type="format-list-bulleted"></Icon>
        分类管理
      </Button>
    </div>
  </div>
</template>
<script>
import TagTree from '@components/tag-tree'
import { fetchGetPoiTagInfo } from '@/data/repos/category'
import { allProduct } from '@/data/constants/poi'
import {
  POI_IS_MEDICINE
} from '@/common/cmm'
import withModules from '@/mixins/withModules'
import state from '../../../../store'

export default {
  name: 'product-tag-list-container',
  mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
  props: {
    sorting: {
      type: Boolean,
      default: false
    },
    tagId: {
      type: Number,
      default: allProduct.id
    }
  },
  data () {
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
    handleSort () {
      this.$emit('sort')
    },
    isShowSetting (item) {
      return item.id !== allProduct.id
    },
    handleSelect (id) {
      this.$emit('change', id)
    },
    handleExpand (idList) {
      this.expandList = idList
    },
    handleOpenSmartSort () {

    },
    async getData () {
      this.loading = true
      try {
        const { tagList, tagInfo } = await fetchGetPoiTagInfo()
        const { smartSortSwitch, topLimit, productTotal } = tagInfo
        // TODO
        state.productCount = productTotal
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
.tag-list-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  span {
    font-weight: bold;
    line-height: 32px;
  }
  button {
    font-size: @font-size-small;
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
}
.tag-list-sort-header {
  display: flex;
  font-weight: bold;
}
.tag-list-footer {
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  border-top: 1px solid @border-color-base;
  border-bottom: 1px solid @border-color-base;
  text-align: center;
}
</style>
