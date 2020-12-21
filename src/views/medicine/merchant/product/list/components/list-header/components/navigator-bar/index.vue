<template>
  <HeaderBar :module-map="moduleMap" @click="handleClick" />
</template>
<script>
  import HeaderBar from '@/components/header-bar'

  // todo  处理批量逻辑
  import { KEYS } from './menus'

  export default {
    name: 'medicine-merchant-product-list-navigator-bar',
    data () {
      return {

      }
    },
    computed: {
      moduleMap () {
        return {
          createProduct: {
            show: true,
            link: '/medicine/merchant/product/edit'
          },
          taskProgress: {
            show: true,
            order: 2
          },
          download: {
            show: true,
            order: 1
          },
          merchantProductConfig: {
            show: true,
            order: 2
          },
          batchOperation: true,
          batchCreate: {
            show: true,
            order: 1
          },
          batchModify: {
            show: true,
            link: {
              name: KEYS.MODIFY
            },
            order: 2
          },
          batchRel: {
            show: true,
            order: 3
          }
        }
      }
    },
    components: {
      HeaderBar
    },
    methods: {
      handleClick (menu) {
        console.log(menu)
        if (menu.key === 'download') {
          alert('待处理')
        }
      }
    }
  }
</script>
