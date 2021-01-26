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
          batchOperation: true,
          batchCreate: {
            link: {
              name: KEYS.MEDICINE_REGISTER_CREATE
            },
            show: true,
            order: 1
          },
          batchModify: {
            show: true,
            link: {
              name: KEYS.MEDICINE_REGISTER_MODIFY
            },
            order: 2
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
