<template>
  <ManageTagList
    labelInValue
    :showSmartSort="!isMedicine"
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
  />
</template>
<script>
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import { createNamespacedHelpers } from 'vuex'
  import {
    POI_IS_MEDICINE
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('productList/tagList')

  export default {
    name: 'product-manage-tag-list-container',
    mixins: [withModules({ isMedicine: POI_IS_MEDICINE })],
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
      ManageTagList
    },
    methods: {
      // TODO callback 关闭弹框
      ...mapActions({
        handleChangeLevel: 'changeLevel',
        handleEdit: 'modify',
        handleAdd: 'add',
        handleDelete: 'delete',
        handleExpand: 'expand'
      }),
      handleSelect (tag) {
        this.$emit('select', tag)
      }
    }
  }
</script>
