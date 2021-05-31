<template>
    <div class="medicine-merchant-batch-sync">
        <iframe
            id="iFrame"
            :src="path"
            scrolling="yes"
            frameBorder="0"
            width="100%">
        </iframe>
    </div>
</template>

<script>
  export default {
    //     methods: {
    //       setIframeHeight (iframe) {
    //         if (iframe) {
    //           var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow
    //           if (iframeWin.document.body) {
    //             iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight
    //           }
    //         }
    //       }
    //     },
    // mounted () {
    //   this.setIframeHeight(document.getElementById('iFrame'))
    // }
    computed: {
      path () {
        const { query } = this.$route
        let queryStr = 'origin=medicineMerchant&tab=hide'
        for (const key in query) {
          queryStr += `&${key}=${query[key]}`
        }
        return `/reuse/sc/product/pages/product/batchManagement/sync?${queryStr}`
      }
    }
  }
</script>

<style lang="less" scoped>
    .medicine-merchant-batch-sync {
        overflow: auto;
        height: 1500px;
        margin: -30px;
        & > iframe {
            height: 100%;
        }
    }
</style>
