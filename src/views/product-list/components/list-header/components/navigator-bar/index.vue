<template>
  <div>
    <HeaderBar
      :left="leftMenu"
      :right="rightMenu"
      @click="handleClick"
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
    fetchSubmitDownloadProduct
  } from '@/data/repos/merchantProduct'
  import DownloadModal from '@components/download-modal'
  import PackbagSettingModal from './packbag-setting-modal'
  import HeaderBar, { menuMap } from '@/components/header-bar'
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
          menus.push(menuMap.videoManage)
        }
        menus.push(menuMap.download)
        if (this.hasPackageBag) {
          menus.push(menuMap.packageBag)
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
        return fetchSubmitDownloadProduct
      }
    },
    methods: {
      handleClick (menu) {
        if (menu.name === 'download') {
          this.downloadVisible = true
        } else if (menu.name === 'packageBag') {
          this.packagebagVisible = true
        }
      }
    }
  }
</script>
