<template>
  <HeaderBar ref="headerBar" :module-map="moduleMap" />
</template>

<script>
  import HeaderBar from '@/components/header-bar'
  export default {
    name: 'register-list-header',
    components: {
      HeaderBar
    },
    computed: {
      moduleMap () {
        return {
          batchUpdateCity: true,
          batchTaskProgress: true
        }
      }
    }
  }
</script>
