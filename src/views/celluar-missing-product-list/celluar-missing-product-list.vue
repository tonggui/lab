<template>
  <div class="celluar-product-list-page">
    <div class="celluar-product-list-page-nav">
      <a @click="handleGoTask"><Icon type="keyboard-arrow-left" size="20" />返回</a>
    </div>
    <ErrorBoundary :error="error" @refresh="getData" class="celluar-product-list-page-content">
      <div class="celluar-product-list-page-task-info">
        <h1><Icon type="star" size="20" />从推荐商品中上架1种{{ taskName }}</h1>
        <div class="celluar-product-list-page-search">
          <Input search :value="keyword" @on-search="handleSearch" enter-button placeholder="商品名称/品牌/UPC码/EAN码" />
          <span class="reset" @click="handleSearch('')">重置</span>
        </div>
      </div>
      <div v-if="empty" class="celluar-product-list-page-empty">
        <p>暂无可上架商品</p>
        <div class="celluar-product-list-page-empty-operation">
          <Button @click="handleGoList">查看上架商品</Button>
          <Button type="primary" @click="handleGoTask">查看其他任务</Button>
        </div>
      </div>
      <div v-else class="celluar-product-list-page-tabs">
        <Tabs :value="activeTab" @on-click="handleTabChange" class="tab">
          <TabPane v-for="tab in tabList" :name="tab.id" :label="tab.label" :key="tab.id">
            <component :is="getComponent(tab.id)" :tag-list="tagList" @after-put-on="handlePutOn" />
          </TabPane>
        </Tabs>
      </div>
      <Loading v-if="loading" />
    </ErrorBoundary>
  </div>
</template>
<script>
  import { stringify } from 'qs'
  import bridgeJump from '@/components/link/bridge-jump'
  import { fetchGetCellularNewProductIsMatchTag } from '@/data/repos/product'
  import { helper } from './store'
  import ExistProductList from './container/exist-product-list'
  import NewProductList from './container/new-product-list'
  import { TAB } from './constants'
  import LoaclStorage, { KEYS } from '@/common/local-storage'

  const { mapState, mapActions, mapGetters } = helper()

  export default {
    name: 'missingProductListPage',
    components: {
      ExistProductList,
      NewProductList
    },
    computed: {
      ...mapState(['activeTab', 'loading', 'error', 'keyword', 'taskDone', 'tabList', 'tagList']),
      ...mapGetters(['taskName', 'empty']),
      spuId () {
        return this.$route.query.spuId
      }
    },
    watch: {
      activeTab: {
        immediate: true,
        async handler (tab) {
          if (tab !== TAB.NEW || LoaclStorage[KEYS.CELLUAR_PRODUCT_MATCH_MODAL]) {
            return
          }
          try {
            const show = await fetchGetCellularNewProductIsMatchTag(this.spuId)
            if (show) {
              this.$Modal.info({
                title: '温馨提示',
                render: () => <p style="text-align: center">平台已自动帮您填写部分新商品的店内分类，无需再手动填写</p>,
                maskClosable: false,
                centerLayout: true,
                iconType: '',
                width: 412,
                okText: '我知道了',
                onOk: () => {
                  LoaclStorage[KEYS.CELLUAR_PRODUCT_MATCH_MODAL] = true
                }
              })
            }
          } catch (err) {
            console.error(err)
          }
        }
      }
    },
    methods: {
      ...mapActions({
        getData: 'init',
        handleSearch: 'search',
        handleTabChange: 'changeTab',
        handleTaskDone: 'finishTask',
        destroy: 'destroy'
      }),
      getComponent (tab) {
        if (tab === TAB.EXIST) {
          return ExistProductList
        }
        if (tab === TAB.NEW) {
          return NewProductList
        }
      },
      handleGoList () {
        this.$router.push({
          path: '/product/list',
          query: {
            wmPoiId: this.$route.query.wmPoiId
          }
        })
      },
      handleGoTask () {
        const query = {
          awardCode: this.$route.query.awardCode,
          awardTypeCode: this.$route.query.awardTypeCode
        }
        const host = process.env.BUSINESS_DIAGNOSE_HOST || 'waimaieapp.meituan.com'
        const link = `${location.protocol}//${host}/igate/recoanalysis/dist/pc-vue?${stringify(query)}#diagnose`
        bridgeJump(link)
      },
      handlePutOn () {
        if (!this.taskDone) {
          this.$Modal.confirm({
            className: 'celluar-product-task-modal',
            centerLayout: true,
            iconType: '',
            renderHeader: () => (
              <div class="celluar-product-task-modal-header" />
            ),
            render: () => (
              <div class="celluar-product-task-modal-content">
                <p>恭喜！任务完成</p>
                距离获得奖励又进一步
              </div>
            ),
            width: 358,
            okText: '查看其他任务',
            cancelText: '继续上架商品',
            onOk: () => {
              this.handleGoTask()
            }
          })
          this.handleTaskDone()
        }
      }
    },
    mounted () {
      this.getData()
    },
    beforeDestroy () {
      this.destroy()
    }
  }
</script>
<style lang="less">
  .celluar-product-list-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    &-nav {
      a {
        color: #858692;
      }
      margin-bottom: 12px;
    }
    &-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fff;
      overflow: hidden;
    }
    &-empty {
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &-operation {
        button {
          margin-right: 16px;
        }
      }
      p {
        font-size: 18px;
        line-height: 66px;
      }
    }
    &-tabs {
      flex: 1;
      overflow: hidden;
      > .boo-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        .boo-tabs-content {
          flex: 1;
          min-height: 400px;
        }
      }
    }
    &-task-info {
      height: 70px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h1 {
        color: #F89800;
        font-size: 16px;
        line-height: 34px;
        i {
          margin-right: 8px;
        }
      }
    }
    &-search {
      height: 100%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      .boo-input-wrapper {
        width: 320px;
        margin-right: 20px;
      }
      .reset {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
  .celluar-product-task-modal {
    .boo-modal-header {
      padding: 0;
    }
    .boo-modal-body {
      padding-top: 16px;
      padding-bottom: 24px;
    }
    &-header {
      height: 127px;
      background: url('./img/modal-bg.png') no-repeat;
      background-size: 360px 100%;
      background-position: -1px -1px;
    }
    &-content {
      text-align: center;
      color: #F89800;
      font-size: 16px;
      p {
        font-size: 20px;
        line-height: 20px;
        margin-bottom: 8px;
      }
    }
  }
</style>
