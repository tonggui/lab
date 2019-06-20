<template>
  <HeaderBar
    :left="leftMenu"
    :right="rightMenu"
  />
</template>

<script>
import HeaderBar from '@/components/header-bar/header-bar'
import { createLeftMenus, createRightMenus } from './menus'
export default {
  name: 'navigator-bar',
  components: {
    HeaderBar
  },
  computed: {
    leftMenu () {
      return createLeftMenus()
    },
    rightMenu () {
      return createRightMenus()
    }
  }
}
</script>
