<template>
  <ManageTagList
    labelInValue
    :show-smart-sort="showSmartSort"
    :loading="loading"
    :tag-list="tagList"
    :product-count="productCount"
    :expand-list="expandList"
    :tag-id="tagId"
    @change-level="handleChangeLevel"
    @open-sort="$emit('open-sort')"
    @delete="handleDelete"
    @edit="handleEdit"
    @add="handleAdd"
    @select="handleSelect"
    @expand="handleExpand"
  >
    <TooltipWithLocalstorage :transfer="false" class="template-entrance" slot="footer" v-if="showCategoryTemplate" keyName="CATEGORY_TEMPLATE_ENTRANCE_TIP" content="可以一键让您的商品分类更合理，转化率更高哦，快来试试看吧。！">
      <Button @click="handleShowCategoryTemplate" icon="list">分类模版</Button>
    </TooltipWithLocalstorage>
  </ManageTagList>
</template>
<script>
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import TooltipWithLocalstorage from '@components/tooltip-with-localstorage'
  import { createNamespacedHelpers } from 'vuex'
  import { wrapperWithCallback } from '@/common/vuex'
  import {
    SWITCH_TAG_SMART_SORT,
    SWITCH_CATEGORY_TEMPLATE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('productList/tagList')

  export default {
    name: 'product-manage-tag-list-container',
    mixins: [withModules({
      showSmartSort: SWITCH_TAG_SMART_SORT,
      showCategoryTemplate: SWITCH_CATEGORY_TEMPLATE
    })],
    computed: {
      ...mapState(['productCount', 'expandList', 'loading']),
      ...mapGetters({
        tagId: 'currentTagId',
        topLimit: 'topLimit',
        smartSortSwitch: 'isSmartSort',
        tagList: 'list'
      })
    },
    components: {
      ManageTagList,
      TooltipWithLocalstorage
    },
    methods: {
      ...mapActions({
        handleChangeLevel: wrapperWithCallback('changeLevel'),
        handleEdit: wrapperWithCallback('modify'),
        handleAdd: wrapperWithCallback('add'),
        handleDelete: wrapperWithCallback('delete'),
        handleExpand: 'expand'
      }),
      handleSelect (tag) {
        this.$emit('select', tag)
      },
      handleShowCategoryTemplate () {
        console.log('start')
      }
    }
  }
</script>
<style lang="less" scoped>
  .template-entrance {
    width: 100%;
    /deep/ .boo-btn {
      width: 100%;
    }
  }
</style>
