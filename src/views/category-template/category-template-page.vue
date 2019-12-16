<template>
  <div>
    <slot v-bind="exportProps"></slot>
    <CategoryTemplateDrawer />
  </div>
</template>
<script>
  import CategoryTemplateDrawer from './container/category-template-drawer'
  import storage, { KEYS } from '@/common/local-storage'
  import { createNamespacedHelpers } from 'vuex'

  const { mapGetters, mapActions } = createNamespacedHelpers('categoryTemplate')

  export default {
    name: 'category-template-container',
    props: {
      guide: Boolean
    },
    computed: {
      ...mapGetters({
        drawerVisible: 'visible',
        showApplying: 'showApplying',
        success: 'success',
        fail: 'fail',
        message: 'message',
        taskApplying: 'taskApplying'
      }),
      guideModalClosed: {
        get () {
          return storage[KEYS.CATEGORY_TEMPLATE_MODAL]
        },
        set (value) {
          storage[KEYS.CATEGORY_TEMPLATE_MODAL] = value
        }
      },
      exportProps () {
        return {
          show: this.handleShowDrawer,
          applying: this.taskApplying
        }
      }
    },
    created () {
      this.$applyingModal = null
    },
    mounted () {
      this.initTemplateTask()
    },
    watch: {
      guide: {
        immediate: true,
        handler (guide) {
          if (guide && !this.guideModalClosed) {
            this.$Modal.confirm({
              title: '分类模版引导',
              content: '平台为您准备了有利于曝光和转化的店内分类模版',
              okText: '查看模版',
              cancelText: '暂时不用',
              onOk: this.handleShowDrawer,
              onCancel: () => {
                this.guideModalClosed = true
              }
            })
          }
        }
      },
      showApplying (showApplying) {
        if (showApplying) {
          this.$applyingModal = this.$Modal.info({
            renderTitle: () => <span><Icon style="margin-right: 4px" local="black-loading" />分类更新中</span>,
            iconType: '',
            content: '更新过程中店内分类信息不支持调整，点击后台运行将返回当前页，您可以进行其他店铺操作',
            centerLayout: true,
            okText: '后台运行',
            onOk: this.handleBackgroundApply
          })
        }
      },
      success (success) {
        if (success) {
          if (this.$applyingModal) {
            this.$applyingModal.destroy()
          }
          this.$Modal.success({
            width: 360,
            title: '分类更新成功',
            iconType: '',
            headBackgroundType: 'success',
            centerLayout: true,
            content: this.message || '恭喜！店内分类生成成功',
            okText: '知道了',
            onOk: this.handleRefreshPage
          })
        }
      },
      fail (fail) {
        if (fail) {
          if (this.$applyingModal) {
            this.$applyingModal.destroy()
          }
          this.$Modal.confirm({
            width: 360,
            title: '分类更新失败',
            iconType: '',
            content: `${this.message ? `因${this.message}` : ''}店内分类生成失败，是否重试？`,
            okText: '重试',
            cancelText: '取消',
            centerLayout: true,
            headBackgroundType: 'warning',
            onOk: this.handleRetry,
            onCancel: this.handleDone
          })
        }
      }
    },
    components: {
      CategoryTemplateDrawer
    },
    beforeDestroy () {
      this.handleDestroy()
    },
    methods: {
      ...mapActions({
        handleDone: 'hide',
        handleShowDrawer: 'show',
        handleBackgroundApply: 'backgroundApply',
        handleRetry: 'retry',
        handleDestroy: 'cancelPolling',
        initTemplateTask: 'init'
      }),
      handleRefreshPage () {
        window.location.reload()
      }
    }
  }
</script>
<style lang="less">
  .background-apply-modal {
    display: flex;
  }
</style>
