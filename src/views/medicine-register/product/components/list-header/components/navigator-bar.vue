<template>
  <div>
    <HeaderBar :module-map="moduleMap" />
  </div>
</template>
<script>
  import HeaderBar from '@/components/header-bar'
  import { KEYS, LINKS } from '@/views/medicine-register/batch-management/menus'

  export default {
    name: 'medicine-register-list-navigator-bar',
    components: {
      HeaderBar
    },
    computed: {
      moduleMap () {
        return {
          batchUpdateCity: {
            show: true,
            link: LINKS.MEDICINE_REGISTER_MODIFY
          },
          batchTaskProgress: {
            show: true,
            link: {
              name: KEYS.MEDICINE_REGISTER_PROGRESS
            }
          }
        }
      }
    }
  }
</script>
