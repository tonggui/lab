<template>
  <div>
    <HeaderBar
      :left="leftMenu"
      :right="rightMenu"
    />
    <DownloadModal
      v-model="downloadVisible"
      :fetch-download-list="fetchGetDownloadTaskList"
      :submit-download="fetchSubmitDownloadProduct"
    />
    <PackbagSettingModal v-model="packagebagVisible" />
  </div>
</template>

<script>
  import {
    fetchGetDownloadTaskList,
    fetchDownloadProduct
  } from '@/data/repos/product'
  import DownloadModal from '@components/download-modal'
  import PackbagSettingModal from './packbag-setting-modal'
  import HeaderBar, { menuMap } from '@/components/header-bar'
  import storage, { KEYS } from '@/common/local-storage'
  import {
    POI_VIOLATION,
    POI_PACKAGE_BAG,
    POI_ERROR_PRODUCT_COUNT,
    POI_IS_MEDICINE,
    PRODUCT_VIDEO
  } from '@/common/cmm'
  import withModules from '@/mixins/withModules'

  export default {
    name: 'navigator-bar',
    mixins: [
      withModules({
        hasViolation: POI_VIOLATION,
        hasPackageBag: POI_PACKAGE_BAG,
        errorProductCount: POI_ERROR_PRODUCT_COUNT,
        isMedicine: POI_IS_MEDICINE,
        hasVideo: PRODUCT_VIDEO
      })
    ],
    props: {
      disabled: Boolean
    },
    data () {
      return {
        downloadVisible: false,
        packagebagVisible: false
      }
    },
    components: {
      HeaderBar,
      DownloadModal,
      PackbagSettingModal
    },
    computed: {
      leftMenu () {
        const { errorProductCount, hasViolation, isMedicine } = this
        if (isMedicine) {
          const list = [
            menuMap.library,
            {
              ...menuMap.batch,
              children: [menuMap.batchCreate, menuMap.batchModify]
            }
          ]
          if (hasViolation) {
            list.push(menuMap.violation)
          }
        }
        return [
          menuMap.create,
          menuMap.library,
          {
            ...menuMap.batch,
            children: [menuMap.batchCreate, menuMap.batchUpload, menuMap.batchModify, menuMap.batchProgress]
          },
          {
            ...menuMap.monitor,
            icon: errorProductCount > 0 ? menuMap.monitor.errorIcon : menuMap.monitor.icon,
            badge: errorProductCount
          }
        ]
      },
      rightMenu () {
        const menus = []
        if (this.hasVideo) {
          menus.push({
            ...menuMap.videoManage,
            badge: storage[KEYS.VIDEO_CENTER_ENTRANCE_BADGE] ? '' : 'new',
            click: () => {
              storage[KEYS.VIDEO_CENTER_ENTRANCE_BADGE] = true
            },
            tooltip: {
              content: '批量上传视频，管理更方便',
              keyName: 'VIDEO_CENTER_ENTRANCE_TIP'
            }
          })
        }
        menus.push({
          ...menuMap.download,
          click: this.showDownloadModal
        })
        if (this.hasPackageBag) {
          menus.push({
            ...menuMap.packageBag,
            click: this.showPackbagModal
          })
        }
        if (!this.isMedicine) {
          menus.push(menuMap.recycle)
        }
        return menus
      },
      fetchGetDownloadTaskList () {
        return fetchGetDownloadTaskList
      },
      fetchSubmitDownloadProduct () {
        return fetchDownloadProduct
      }
    },
    methods: {
      showDownloadModal () {
        this.downloadVisible = true
      },
      showPackbagModal () {
        this.packagebagVisible = true
      }
    }
  }
</script>
