<template>
  <div>
    <HeaderBar
      :left="leftMenu"
      :right="rightMenu"
      @click="handleClick"
    />
    <DownloadModal
      v-model="visible"
      :fetch-download-list="fetchGetDownloadTaskList"
      :submit-download="fetchSubmitDownloadProduct"
    />
  </div>
</template>
<script>
  import {
    fetchGetDownloadTaskList,
    fetchSubmitDownloadProduct
  } from '@/data/repos/merchantProduct'
  import DownloadModal from '@components/download-modal'
  import HeaderBar, { menuMap } from '@/components/header-bar'

  const leftMenu = [menuMap.create, menuMap.unApproveList, menuMap.taskProgress]
  const rightMenu = [menuMap.download]
  export default {
    name: 'merchant-product-list-header',
    data () {
      return {
        visible: false
      }
    },
    computed: {
      leftMenu () {
        return leftMenu
      },
      rightMenu () {
        return rightMenu
      },
      fetchGetDownloadTaskList () {
        return fetchGetDownloadTaskList
      },
      fetchSubmitDownloadProduct () {
        return fetchSubmitDownloadProduct
      }
    },
    components: {
      HeaderBar,
      DownloadModal
    },
    methods: {
      handleClick (menu) {
        if (menu === menuMap.download) {
          this.visible = true
        }
      }
    }
  }
</script>
