<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <router-view :name="type"></router-view>
  </div>
</template>
<script>
  import { mapModule } from '@/module/module-manage/vue'
  import { PAGE_GRAY } from '@/module/moduleTypes'

  const grayMap = {
    '/product/edit': 'new_product_edit'
  }

  export default {
    name: 'app',
    computed: {
      ...mapModule({
        pageGary: PAGE_GRAY
      }),
      type () {
        const route = this.$router.match(window.location.pathname)
        if (grayMap[route.path]) {
          const gray = this.pageGary[grayMap[route.path]]
          return gray ? 'gray' : 'default'
        }
        return 'default'
      }
    }
  }
</script>

<style lang="less">
  html, body {
    background: @body-background;
    height: 100%;
  }
  body {
    margin: 0 auto;
    padding: 0;
    min-width: 1024px;
    max-width: 1280px;
    color: @text-color;
    font-size: @font-size-base;
    line-height: @line-height-base;
    font-family: @font-family;
    -webkit-font-smoothing: initial;
  }
  #app {
    height: 100%;
  }
</style>
