<template>
  <HeaderBar
    :left="leftMenu"
    :right="rightMenu"
  />
</template>
<script>
  import HeaderBar from '@/components/header-bar/header-bar'
  import menuMap from '@/views/product-list/components/list-header/components/navigator-bar/menuConfig'

  const leftMenu = [menuMap.create]
  const rightMenu = [menuMap.download]
  export default {
    name: 'merchant-product-list-header',
    computed: {
      leftMenu () {
        return leftMenu
      },
      rightMenu () {
        return rightMenu
      }
    },
    components: {
      HeaderBar
    }
  }
</script>
