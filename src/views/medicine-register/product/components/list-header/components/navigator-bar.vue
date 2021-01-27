<template>
  <div>
    <HeaderBar :module-map="moduleMap" />
  </div>
</template>
<script>
  import HeaderBar from '@/components/header-bar'
  import { KEYS } from '@/views/medicine-register/batch-management/menus'

  export default {
    name: 'medicine-register-list-navigator-bar',
    components: {
      HeaderBar
    },
    computed: {
      moduleMap () {
        return {
          createRegister: true,
          batchSetting: {
            order: 1,
            show: true,
            link: {
              name: KEYS.MEDICINE_REGISTER_MODIFY
            }
          },
          taskProgress: {
            order: 2,
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
