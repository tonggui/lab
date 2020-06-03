<template>
  <ProductEdit :mode="mode" />
</template>

<script>
  import { EDIT_TYPE } from '@/data/enums/common'
  import ProductEdit from '../product-edit/index'

  export default {
    name: 'product-audit-edit',
    components: { ProductEdit },
    computed: {
      mode () {
        return this.$route.query.modify === '1' ? EDIT_TYPE.AUDITING_MODIFY_AUDIT : EDIT_TYPE.CHECK_AUDIT
      }
    }
  }
</script>
