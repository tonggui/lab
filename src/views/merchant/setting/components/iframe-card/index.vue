<template>
  <div class="iframe-card">
    <iframe ref="iframeCard" :src="url"></iframe>
  </div>
</template>
<script>
  import { getPoiId } from '@/common/constants'

  export default {
    name: 'iframe-card',
    data () {
      const random = Math.random()
      return { submitting: false, url: window.location.origin + `/reuse/sc/product/views/setting?wmPoiId=${getPoiId()}&from=single&random=${random}` }
    },
    mounted () {
      this.$refs.iframeCard.onload = () => {
        let height = 0
        let win = this.$refs.iframeCard.contentWindow
        win.document.getElementsByClassName('breadcrumb')[0].style.display = 'none'
        let cardDoms = win.document.getElementsByClassName('setting-info-card')
        cardDoms.forEach((dom) => {
          height += dom.offsetHeight
          dom.style.borderRadius = 'unset'
        })
        this.$refs.iframeCard.style.height = height + (cardDoms.length - 1) * 20 + 'px'
      }
    }
  }
</script>
<style lang="less">
  .iframe-card {
    background: @component-bg;
    box-shadow: 1px 1px 5px 0 rgba(0,0,0,0.30);
    margin: 20px 0;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
</style>
