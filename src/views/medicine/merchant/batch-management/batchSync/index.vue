<template>
    <div class="medicine-merchant-batch-sync">
        <iframe
            id="iFrame"
            src="/reuse/sc/product/pages/product/batchManagement/sync"
            scrolling="yes"
            frameBorder="0"
            width="100%"
            onload="this.height=this.contentWindow.document.documentElement.scrollHeight">
        </iframe>
    </div>
</template>

<script>
//   export default {
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
//     mounted () {
//       this.setIframeHeight(document.getElementById('iFrame'))
//     }
//   }
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
