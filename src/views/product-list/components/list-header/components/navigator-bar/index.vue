<template>
  <div>
    <HeaderBar ref="headerBar" need-permission :module-map="moduleMap" @click="handleClick" :disabled="disabled" />
    <DownloadModal
      v-model="downloadVisible"
      :fetch-download-list="fetchGetDownloadTaskList"
      :submit-download="fetchSubmitDownloadProduct"
      :columns="columns"
    />
    <ShoppingBagSettingModal v-model="shoppingBagVisible" />
    <ProductPromotionModal v-model="showProductPromotionModal" @on-ok="showProductPromotionModal = false" />
    <!-- <MonitorModal v-if="!closedMonitorModal" @show-monitor-icon="handleShowMonitor" @closed="handleMonitorModalHidden" :get-anchor-position="getAnchorPosition" /> -->
  </div>
</template>

<script>
  import {
    fetchGetDownloadTaskList,
    fetchDownloadProduct
  } from '@/data/repos/product'
  import {
    fetchGetPoiAuditProductCount,
    fetchGetPoiAuditSpCount
  } from '@/data/repos/poi'
  import DownloadModal from '@components/download-modal'
  import ShoppingBagSettingModal from './shopping-bag-setting-modal'
  // import MonitorModal from './monitor-modal'
  import ProductPromotionModal from './product-promotion-modal'
  import HeaderBar from '@/components/header-bar'
  import storage, { KEYS } from '@/common/local-storage'
  import {
    POI_VIOLATION,
    POI_SHOPPING_BAG,
    POI_ERROR_PRODUCT_COUNT,
    PRODUCT_CREATE_ENTRANCE,
    PRODUCT_VIDEO,
    POI_RECYCLE,
    BATCH_UPLOAD_IMAGE,
    POI_AUTO_CLEAR_STOCK,
    POI_AUDIT_ENTRANCE,
    POI_SP_AUDIT_ENTRANCE,
    PACKAGE_PRODUCT_MODULE_SWITCH,
    PRODUCT_PROMOTION_SETTING
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'
  import moment from 'moment'

  export default {
    name: 'navigator-bar',
    props: {
      disabled: Boolean,
      tagId: Number
    },
    data () {
      return {
        downloadVisible: false,
        shoppingBagVisible: false,
        showProductPromotionModal: false,
        auditProductCount: 0,
        auditSpCount: 0,
        showMonitor: false,
        columns: [
          {
            title: '操作名称',
            key: 'name'
          },
          {
            title: '操作时间',
            key: 'utime',
            width: 180,
            render (h, { row }) {
              const { utime } = row
              const time = moment(utime * 1000).format('YYYY-MM-DD HH:mm:ss')
              return <span>{ time }</span>
            }
          },
          {
            title: '操作状态',
            width: 100,
            render: (h, params) => {
              let statusText = ''
              if (params.row.status === 0) {
                statusText = '生成中'
              } else if (params.row.status === 1) {
                if (params.row.result !== 1) {
                  statusText = '生成失败'
                } else if (params.row.result === 1) {
                  statusText = '已生成'
                }
              }
              return h('span', statusText)
            }
          },
          {
            title: '下载',
            width: 100,
            render: (h, params) => {
              const { status, result, output } = params.row
              if (status === 1) {
                if (result !== 1) {
                  return h('span', { class: 'danger' }, '请重新下载')
                }
                return h(
                  'a',
                  {
                    attrs: {
                      target: '_blank',
                      href: output
                    }
                  },
                  '下载'
                )
              }
              return ''
            }
          }
        ]
      }
    },
    components: {
      HeaderBar,
      DownloadModal,
      ShoppingBagSettingModal,
      ProductPromotionModal
      // MonitorModal
    },
    computed: {
      ...mapModule({
        showProductPromotion: PRODUCT_PROMOTION_SETTING, // 商品配置中 - 商品推广
        showViolation: POI_VIOLATION, // 违规 入口
        showShoppingBag: POI_SHOPPING_BAG, // 购物袋袋 入口
        errorProductCount: POI_ERROR_PRODUCT_COUNT,
        showProductCreate: PRODUCT_CREATE_ENTRANCE,
        showVideoCenter: PRODUCT_VIDEO,
        showRecycle: POI_RECYCLE,
        showBatchUpload: BATCH_UPLOAD_IMAGE,
        showAutoClearStock: POI_AUTO_CLEAR_STOCK,
        showAudit: POI_AUDIT_ENTRANCE,
        showSpAudit: POI_SP_AUDIT_ENTRANCE,
        supportPackageProduct: PACKAGE_PRODUCT_MODULE_SWITCH
      }),
      closedMonitorModal () {
        return !!storage[KEYS.MONITOR_MODAL] // 用户有没有最小化过
      },
      moduleMap () {
        return {
          createProduct: {
            show: this.showProductCreate,
            link: {
              query: {
                tagId: this.tagId
              }
            }
          },
          packageProduct: this.supportPackageProduct,
          productLibrary: true,
          batchCreate: true,
          batchModify: true,
          batchUpload: this.showBatchUpload,
          batchProgress: this.showTaskProgress,
          batchOperation: {
            show: true,
            id: 'monitor-anchor'
          },
          monitor: {
            show: true,
            hide: !this.closedMonitorModal && !this.showMonitor,
            active: this.errorProductCount > 0,
            badge: this.errorProductCount,
            transitionName: !this.showMonitor ? 'shake-bounce' : ''
          },
          autoClearStock: this.showAutoClearStock,
          productConfig: {
            show: true,
            badge: this.showProductPromotion && !storage[KEYS.PRODUCT_LIST_SETTING],
            tooltip: {
              type: 'custom',
              content: '点击这⾥可查看“商品推广”功能的合作品牌及享受补贴的品牌商品～',
              width: 348,
              keyName: 'PRODUCT_LIST_PROMOTION',
              disabled: !this.showProductPromotion
            }
          },
          videoManage: {
            show: this.showVideoCenter,
            badge: storage[KEYS.VIDEO_CENTER_ENTRANCE_BADGE] ? '' : 'new',
            tooltip: {
              type: 'guide',
              content: '批量上传视频，管理更方便',
              keyName: 'VIDEO_CENTER_ENTRANCE_TIP'
            }
          },
          download: true,
          shoppingBag: this.showShoppingBag,
          recycle: this.showRecycle,
          audit: {
            show: this.showAudit,
            badge: this.auditProductCount
          },
          spAudit: {
            show: this.showSpAudit,
            badge: this.auditSpCount
          }
        }
      },
      fetchGetDownloadTaskList () {
        return fetchGetDownloadTaskList
      },
      fetchSubmitDownloadProduct () {
        return fetchDownloadProduct
      }
    },
    methods: {
      async getAuditProductCount () {
        let count = 0
        try {
          count = await fetchGetPoiAuditProductCount()
        } catch (err) {
          console.error(err)
        }
        this.auditProductCount = count
      },
      async getAuditSpCount () {
        let count = 0
        try {
          count = await fetchGetPoiAuditSpCount()
        } catch (err) {
          console.error(err)
        }
        this.auditSpCount = count
      },
      getAnchorPosition () {
        const $headerBar = this.$refs.headerBar && this.$refs.headerBar.$el
        if (!$headerBar) {
          return
        }
        const $anchor = $headerBar.querySelector('#monitor-anchor')
        if (!$anchor) {
          return
        }
        const { right, top } = $anchor.getBoundingClientRect()
        return [right + 60, top + 20]
      },
      handleClick (menu) {
        switch (menu.key) {
        case 'download':
          this.downloadVisible = true
          break
        case 'shoppingBag':
          this.shoppingBagVisible = true
          break
        case 'videoManage':
          storage[KEYS.VIDEO_CENTER_ENTRANCE_BADGE] = true
          break
        case 'productConfig':
          storage[KEYS.PRODUCT_LIST_SETTING] = true
          break
        }
      },
      handleMonitorModalHidden () {
        storage[KEYS.MONITOR_MODAL] = true
      },
      handleShowMonitor () {
        this.showMonitor = true
      }
    },
    watch: {
      showAudit: {
        handler: function (val) {
          if (val) {
            this.getAuditProductCount()
          }
        },
        immediate: true
      },
      showSpAudit: {
        handler: function (val) {
          if (val) {
            this.getAuditSpCount()
          }
        },
        immediate: true
      },
      showProductPromotion (val) {
        if (val) {
          this.showProductPromotionModal = true
        }
      }
    },
    mounted () {
      // if (this.showAudit) {
      //   this.getAuditProductCount()
      // }
      // if (this.showSpAudit) {
      //   this.getAuditSpCount()
      // }
    }
  }
</script>
<style lang="less">
  @keyframes shake-bounce-in {
    0%,to {
      transform: translateZ(0)
    }

    20%, 60% {
      transform: translate3d(-10px,0,0)
    }

    40%, 80% {
      transform: translate3d(10px,0,0)
    }
  }

  .shake-bounce-enter-active {
    animation: shake-bounce-in .4s linear;
  }
</style>
