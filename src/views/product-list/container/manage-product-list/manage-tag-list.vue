<template>
  <div ref="tagList">
    <ErrorBoundary
      :error="error"
      :top="200"
      @refresh="handleRefresh"
      description="商品获取失败～"
    >
      <ManageTagList
        label-in-value
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
        :before-create="beforeCreateTag"
      >
        <Alert slot="tip" show-icon type="warning" class="tag-list-tip" closable @on-close="handleCloseTip" v-if="showTagTip">
          一级分类数量过多，将严重影响买家进店转化；我们建议{{ maxFirstLevelNum }}个为宜。
          <a v-if="guide.link && guide.content" :href="guide.link" target="_blank">{{ guide.content }}</a>
        </Alert>
        <CategoryTemplateEntrance slot="footer" v-if="showTemplateEntrance" class="template-entrance" @click="handleShowCategoryTemplate" />
      </ManageTagList>
    </ErrorBoundary>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import ManageTagList from '@/views/components/manage-tag-list' // 分类管理
  import CategoryTemplateEntrance from '@/views/product-list/components/category-template-entrance'
  import storage, { KEYS } from '@/common/local-storage'
  import withPromiseEmit from '@/hoc/withPromiseEmit'
  import {
    TAG_SMART_SORT,
    CATEGORY_TEMPLATE,
    TAG_FIRST_LEVEL_LIMIT,
    TAG_FIRST_LEVEL_GUIDE
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  const { mapGetters, mapState, mapActions } = createNamespacedHelpers('productList/tagList')

  export default {
    name: 'product-manage-tag-list-container',
    props: {
      supportCategoryTemplate: Boolean // 是否支持开启分类模版
    },
    computed: {
      ...mapModule({
        showSmartSort: TAG_SMART_SORT,
        showTemplateEntrance: CATEGORY_TEMPLATE,
        maxFirstLevelNum: TAG_FIRST_LEVEL_LIMIT,
        guide: TAG_FIRST_LEVEL_GUIDE
      }),
      ...mapState(['productCount', 'expandList', 'loading', 'error']),
      ...mapGetters({
        tagId: 'currentTagId',
        topLimit: 'topLimit',
        smartSortSwitch: 'isSmartSort',
        tagList: 'list'
      }),
      isOverTagLimit () {
        return this.tagList.length >= this.maxFirstLevelNum
      },
      showTagTip () {
        return this.isOverTagLimit && !storage[KEYS.CATEGORY_MAX_FIRST_LEVEL_TIP]
      }
    },
    components: {
      ManageTagList: withPromiseEmit(ManageTagList),
      CategoryTemplateEntrance
    },
    methods: {
      ...mapActions({
        handleChangeLevel: 'changeLevel',
        handleEdit: 'modify',
        handleAdd: 'add',
        handleDelete: 'delete',
        handleExpand: 'expand',
        handleRefresh: 'getList'
      }),
      handleSelect (tag) {
        this.$emit('select', tag)
      },
      handleShowCategoryTemplate () {
        this.$emit('show-category-template')
      },
      beforeCreateTag (callback) {
        if (this.isOverTagLimit && this.supportCategoryTemplate) {
          this.$Modal.confirm({
            title: '警告',
            render: (h) => (
              <div>一级分类数量过多，将影响买家进店转化，我们建议{this.maxFirstLevelNum}个为宜。
                <a href="https://collegewm.meituan.com/sg/post/detail?id=176&contentType=0">快速优化分类教程</a>
              </div>
            ),
            okText: '使用模版优化',
            cancelText: '继续新建',
            onCancel: callback,
            onOk: this.handleShowCategoryTemplate
          })
          return
        }
        callback()
      },
      handleCloseTip () {
        storage[KEYS.CATEGORY_MAX_FIRST_LEVEL_TIP] = true
      }
    }
  }
</script>
<style lang="less" scoped>
  .tag-list-tip {
    font-size: @font-size-small;
    margin-bottom: 6px;
    padding: 8px 24px 8px 28px;
    /deep/ .boo-alert-icon {
      left: 8px;
    }
    /deep/ .boo-alert-close {
      right: 2px;
    }
  }
  .template-entrance {
    padding: 10px 20px;
    margin-right: -1px;
    /deep/ .boo-btn {
      width: 180px;
    }
  }
</style>
