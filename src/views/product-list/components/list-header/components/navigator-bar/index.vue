<template>
  <div>
    <HeaderBar :module-map="moduleMap" @click="handleClick" :disabled="disabled" />
    <DownloadModal
      v-model="downloadVisible"
      :fetch-download-list="fetchGetDownloadTaskList"
      :submit-download="fetchSubmitDownloadProduct"
    />
    <ShoppingBagSettingModal v-model="shoppingBagVisible" />
  </div>
</template>

<script>
  import {
    fetchGetDownloadTaskList,
    fetchDownloadProduct
  } from '@/data/repos/product'
  import DownloadModal from '@components/download-modal'
  import ShoppingBagSettingModal from './shopping-bag-setting-modal'
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
    POI_AUDIT_PRODUCT_COUNT
  } from '@/module/moduleTypes'
  import { mapModule } from '@/module/module-manage/vue'

  export default {
    name: 'navigator-bar',
    props: {
      disabled: Boolean,
      tagId: Number
    },
    data () {
      return {
        downloadVisible: false,
        shoppingBagVisible: false
      }
    },
    components: {
      HeaderBar,
      DownloadModal,
      ShoppingBagSettingModal
    },
    computed: {
      ...mapModule({
        showViolation: POI_VIOLATION, // 违规 入口
        showShoppingBag: POI_SHOPPING_BAG, // 购物袋袋 入口
        errorProductCount: POI_ERROR_PRODUCT_COUNT,
        showProductCreate: PRODUCT_CREATE_ENTRANCE,
        showVideoCenter: PRODUCT_VIDEO,
        showRecycle: POI_RECYCLE,
        showBatchUpload: BATCH_UPLOAD_IMAGE,
        showAutoClearStock: POI_AUTO_CLEAR_STOCK,
        showAudit: POI_AUDIT_ENTRANCE,
        auditProductCount: POI_AUDIT_PRODUCT_COUNT
      }),
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
          productLibrary: true,
          batchCreate: true,
          batchModify: true,
          batchUpload: this.showBatchUpload,
          batchProgress: this.showTaskProgress,
          monitor: {
            show: true,
            active: this.errorProductCount > 0,
            badge: this.errorProductCount
          },
          autoClearStock: this.showAutoClearStock,
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
        }
      }
    }
  }
</script>
