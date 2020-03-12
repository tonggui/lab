<template>
  <div>
    <slot v-bind="exportProps"></slot>
    <CategoryTemplateDrawer />
  </div>
</template>
<script>
  import CategoryTemplateDrawer from './container/category-template-drawer'
  import { createNamespacedHelpers } from 'vuex'
  import jumpTo from '@/components/link/jumpTo'
  import { mapModule } from '@/module/module-manage/vue'
  import { CATEGORY_TEMPLATE } from '@/module/moduleTypes'

  const { mapGetters, mapActions, mapState } = createNamespacedHelpers('categoryTemplate')

  export default {
    name: 'category-template-container',
    computed: {
      ...mapModule({
        supportCategoryTemplate: CATEGORY_TEMPLATE
      }),
      ...mapState(['usedBusinessTemplate']),
      ...mapGetters({
        drawerVisible: 'visible',
        showApplying: 'showApplying',
        success: 'success',
        fail: 'fail',
        message: 'message',
        classifyStatus: 'classifyStatus',
        taskApplying: 'taskApplying',
        initStatus: 'init'
      }),
      exportProps () {
        return {
          show: this.handleShowDrawer,
          applying: this.taskApplying,
          usedBusinessTemplate: this.usedBusinessTemplate
        }
      }
    },
    created () {
      this.$applyingModal = null
      this.$successModal = null
    },
    mounted () {
      this.startCategoryTemplate()
    },
    watch: {
      showApplying (showApplying) {
        if (!showApplying) {
          return
        }
        this.$applyingModal = this.$Modal.info({
          renderTitle: () => <span><Icon style="margin-right: 4px" local="black-loading" />分类更新中</span>,
          iconType: '',
          content: '更新过程中店内分类信息不支持调整，点击后台运行将返回当前页，您可以进行其他店铺操作',
          centerLayout: true,
          okText: '后台运行',
          onOk: this.handleBackgroundApply
        })
      },
      success (success) {
        if (!success) {
          return
        }
        if (this.$applyingModal) {
          this.$applyingModal.destroy()
        }
        this.$successModal = this.$Modal.success({
          width: 360,
          title: '分类更新成功',
          iconType: '',
          headBackgroundType: 'success',
          centerLayout: true,
          content: this.message || '恭喜！店内分类生成成功',
          renderFooter: () => {
            const buttons = [<Button type="primary" onClick={this.handleRefresh}>我知道了</Button>]
            if (this.classifyStatus) {
              buttons.unshift(<Button type="primary" onClick={this.handleJumpToList}>管理分类</Button>)
            }
            return (<div style="text-align: center">{buttons}</div>)
          }
        })
      },
      fail (fail) {
        if (!fail) {
          return
        }
        if (this.$applyingModal) {
          this.$applyingModal.destroy()
        }
        this.$Modal.confirm({
          width: 360,
          title: '分类更新失败',
          iconType: '',
          content: this.message || '店内分类生成失败，是否重试？',
          okText: '重试',
          cancelText: '取消',
          centerLayout: true,
          headBackgroundType: 'warning',
          onOk: async () => {
            try {
              await this.handleRetry()
            } catch (err) {
              this.$Message.error(err.message)
              throw err
            }
          },
          onCancel: this.handleDone
        })
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
        startCategoryTemplate: 'init',
        handleSuccessBroadcast: 'successBroadcast'
      }),
      handleJumpToList () {
        const path = this.$route.path
        if (path !== '/product/list') {
          jumpTo('/product/list')
          this.$successModal && this.$successModal.destroy()
        } else {
          this.handleRefresh()
        }
      },
      handleRefresh () {
        this.handleSuccessBroadcast()
        if (this.$successModal) {
          this.$successModal.destroy()
        }
      }
    }
  }
</script>
<style lang="less">
  .background-apply-modal {
    display: flex;
  }
</style>
