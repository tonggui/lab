<template>
  <CategoryTemplateDrawer />
</template>
<script>
  import CategoryTemplateDrawer from './category-template-drawer/index'
  import storage, { KEYS } from '@/common/local-storage'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'category-template-container',
    props: {
      guide: Boolean
    },
    computed: {
      ...mapGetters('productList/template', {
        drawerVisible: 'visible',
        applying: 'showApplying',
        success: 'success',
        fail: 'fail',
        message: 'message'
      }),
      guideModalClosed: {
        get () {
          return storage[KEYS.CATEGORY_TEMPLATE_MODAL]
        },
        set (value) {
          storage[KEYS.CATEGORY_TEMPLATE_MODAL] = value
        }
      }
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
      applying (applying) {
        if (applying) {
          this.$Modal.info({
            render (h) {
              return (
                <div class="background-apply-modal">
                  <Icon type="loading" size="20" style="margin-right: 20px" />
                  <div>
                    店内分类生成中，点击后台运行，则进入商品列表页；生成成功后将会通知您，在店内分类生成期间，请勿调整当前店内分类信息
                  </div>
                </div>
              )
            },
            okText: '后台运行',
            onOk: this.handleBackgroundApply
          })
        }
      },
      success (success) {
        if (success) {
          this.$Modal.success({
            content: this.message || '恭喜！店内分类生成成功',
            okText: '我知道了',
            onOk: this.handleRefreshPage
          })
        }
      },
      fail (fail) {
        if (fail) {
          this.$Modal.confirm({
            content: `${this.message ? `因${this.message}` : ''}店内分类生成失败，是否重试？`,
            okText: '立即重试',
            cnacelText: '退出',
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
      ...mapActions('productList/template', {
        handleDone: 'hide',
        handleShowDrawer: 'show',
        handleBackgroundApply: 'backgroundApply',
        handleRetry: 'retry',
        handleDestroy: 'cancelPolling'
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
