<template>
  <HeaderBar :module-map="moduleMap" @click="handleClick" />
</template>
<script>
  import HeaderBar from '@/components/header-bar'
  import { KEYS } from '@/views/medicine-register/batch-management/menus'

  export default {
    name: 'medicine-register-list-navigator-bar',
    inject: ['addMedicineSettings'],
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
    },
    methods: {
      handleClick (menu) {
        console.log(menu)
        if (menu.key === 'createRegister') {
          this.addMedicineSettings()
        }
      }
    }
  }
</script>
